#!/usr/bin/env node
/**
 * scalability.mjs — zero-dependency load / capacity test for the QC frontend.
 *
 * Ramps concurrent "virtual users" (VUs) through a series of stages and, at each stage,
 * measures throughput, latency percentiles and error rate. It then reports the highest
 * concurrency the site sustained within your SLOs — i.e. "how many users can it handle".
 *
 * Requires Node >= 20 (uses global fetch / AbortController). No npm install needed.
 *
 *   node loadtest/scalability.mjs --url http://localhost:3000
 *   node loadtest/scalability.mjs --url http://localhost:3000 --stages 10,25,50,100,200 --duration 20
 *
 * ⚠️  ONLY run this against infrastructure you own or are explicitly authorised to test.
 *     Load testing someone else's service without permission is abusive (effectively a DoS).
 *     For any non-localhost target you must pass --yes (or CONFIRM=1) to confirm authorisation.
 *
 * See loadtest/README.md for the full guide (auth cookies, interpreting results, k6 variant).
 */

import { writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))

// ----------------------------------------------------------------------------- config / args
function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith("--")) continue
    const key = a.slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith("--")) {
      out[key] = true // boolean flag
    } else {
      out[key] = next
      i++
    }
  }
  return out
}

const args = parseArgs(process.argv.slice(2))
if (args.help || args.h) {
  printHelp()
  process.exit(0)
}

const cfg = {
  url: (args.url || process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, ""),
  stages: parseList(args.stages || process.env.STAGES || "10,25,50,100,200,400").map(Number),
  duration: Number(args.duration || process.env.DURATION || 20), // seconds per stage
  warmup: Number(args.warmup ?? process.env.WARMUP ?? 5), // seconds, 0 to disable
  cooldown: Number(args.cooldown ?? process.env.COOLDOWN ?? 3), // seconds between stages
  thinkMin: Number(args["think-min"] ?? process.env.THINK_MIN ?? 0.5), // seconds
  thinkMax: Number(args["think-max"] ?? process.env.THINK_MAX ?? 2.0), // seconds
  timeout: Number(args.timeout || process.env.TIMEOUT || 30) * 1000, // per-request ms
  p95Slo: Number(args["p95-slo"] || process.env.P95_SLO_MS || 1000), // ms
  errorSlo: Number(args["error-slo"] || process.env.ERROR_SLO_PCT || 1), // percent
  abortErrorPct: Number(args["abort-error-pct"] || process.env.ABORT_ERROR_PCT || 50), // stop ramping above this
  cookie: args.cookie || process.env.COOKIE || "",
  confirmed: Boolean(args.yes || process.env.CONFIRM === "1"),
  outDir: args.out || process.env.OUT_DIR || join(HERE, "results"),
  routes: buildRoutes(args.routes || process.env.ROUTES, args["soq-routes"] || process.env.SOQ_ROUTES, args.cookie || process.env.COOKIE),
  followRedirects: !(args["no-redirects"] || process.env.NO_REDIRECTS === "1"),
}

function parseList(s) {
  return String(s).split(",").map((x) => x.trim()).filter(Boolean)
}

function buildRoutes(routesArg, soqRoutesArg, cookie) {
  if (routesArg) {
    // "/path:weight,/other" — weight optional, defaults to 1
    return parseList(routesArg).map((entry) => {
      const [path, weight] = entry.split(":")
      return { path, weight: Number(weight) || 1 }
    })
  }
  // Default public route mix (weights ~ relative traffic share).
  const routes = [
    { path: "/", weight: 5 },
    { path: "/soq", weight: 4 },
    { path: "/blogs", weight: 3 },
    { path: "/whitepapers", weight: 2 },
    { path: "/aboutus", weight: 1 },
    { path: "/soq/login", weight: 1 },
  ]
  // Gated SoQ content routes are only meaningful with an authenticated cookie.
  if (cookie && soqRoutesArg) {
    for (const p of parseList(soqRoutesArg)) routes.push({ path: p, weight: 3 })
  }
  return routes
}

// ----------------------------------------------------------------------------- safety guard
function hostOf(u) {
  try {
    return new URL(u).hostname
  } catch {
    return ""
  }
}
const host = hostOf(cfg.url)
const isLocal = ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(host)
if (!isLocal && !cfg.confirmed) {
  console.error(`\n✖ Refusing to load-test a non-local host (${host}) without confirmation.\n`)
  console.error("  Load testing infrastructure you don't own/operate is abusive.")
  console.error("  If you own or are authorised to test this target, re-run with --yes\n")
  process.exit(2)
}

// ----------------------------------------------------------------------------- helpers
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const now = () => performance.now()
const fmt = (n, d = 1) => (Number.isFinite(n) ? n.toFixed(d) : "—")

function percentile(sortedAsc, p) {
  if (sortedAsc.length === 0) return NaN
  const idx = Math.min(sortedAsc.length - 1, Math.ceil((p / 100) * sortedAsc.length) - 1)
  return sortedAsc[Math.max(0, idx)]
}

function buildCumulativeWeights(routes) {
  const total = routes.reduce((s, r) => s + r.weight, 0)
  let acc = 0
  return routes.map((r) => ({ path: r.path, cum: (acc += r.weight) / total }))
}
const cumWeights = buildCumulativeWeights(cfg.routes)
function pickRoute() {
  const x = Math.random()
  for (const r of cumWeights) if (x <= r.cum) return r.path
  return cumWeights[cumWeights.length - 1].path
}

const baseHeaders = {
  "User-Agent": "qc-scalability-loadtest/1.0 (+authorised testing only)",
  Accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
  ...(cfg.cookie ? { Cookie: cfg.cookie } : {}),
}

async function timedRequest(path) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), cfg.timeout)
  const start = now()
  try {
    const res = await fetch(cfg.url + path, {
      headers: baseHeaders,
      redirect: cfg.followRedirects ? "follow" : "manual",
      signal: ctrl.signal,
    })
    // Drain the body so the connection completes (and we count real transfer time).
    const buf = await res.arrayBuffer()
    return { ok: res.ok || (res.status >= 300 && res.status < 400), status: res.status, ms: now() - start, bytes: buf.byteLength, path }
  } catch (err) {
    const aborted = err?.name === "AbortError"
    return { ok: false, status: aborted ? "timeout" : "error", ms: now() - start, bytes: 0, path, err: String(err?.message || err) }
  } finally {
    clearTimeout(t)
  }
}

// ----------------------------------------------------------------------------- VU + stage
async function virtualUser(deadline, samples, stop) {
  while (now() < deadline && !stop.flag) {
    const path = pickRoute()
    samples.push(await timedRequest(path))
    if (now() >= deadline || stop.flag) break
    const think = (cfg.thinkMin + Math.random() * Math.max(0, cfg.thinkMax - cfg.thinkMin)) * 1000
    if (think > 0) await sleep(think)
  }
}

async function runStage(vus) {
  const samples = []
  const stop = { flag: false }
  const stageStart = now()
  const deadline = stageStart + cfg.duration * 1000

  // Early-abort watchdog: if the server is clearly collapsing, stop this stage.
  const watchdog = setInterval(() => {
    if (samples.length >= 50) {
      const errs = samples.filter((s) => !s.ok).length
      if ((errs / samples.length) * 100 >= cfg.abortErrorPct) stop.flag = true
    }
  }, 1000)

  const users = Array.from({ length: vus }, () => virtualUser(deadline, samples, stop))
  await Promise.all(users)
  clearInterval(watchdog)

  const wallSec = (now() - stageStart) / 1000
  return summarize(vus, samples, wallSec, stop.flag)
}

function summarize(vus, samples, wallSec, aborted) {
  const oks = samples.filter((s) => s.ok)
  const errs = samples.filter((s) => !s.ok)
  const durs = oks.map((s) => s.ms).sort((a, b) => a - b)
  const total = samples.length
  const bytes = samples.reduce((s, x) => s + x.bytes, 0)

  // Per-status breakdown
  const byStatus = {}
  for (const s of samples) byStatus[s.status] = (byStatus[s.status] || 0) + 1

  // Per-route p95
  const byRoute = {}
  for (const s of samples) {
    const r = (byRoute[s.path] ||= { n: 0, err: 0, durs: [] })
    r.n++
    if (s.ok) r.durs.push(s.ms)
    else r.err++
  }
  for (const r of Object.values(byRoute)) {
    r.durs.sort((a, b) => a - b)
    r.p95 = percentile(r.durs, 95)
    r.errPct = (r.err / r.n) * 100
  }

  return {
    vus,
    total,
    ok: oks.length,
    errors: errs.length,
    errorPct: total ? (errs.length / total) * 100 : 0,
    rps: wallSec > 0 ? total / wallSec : 0,
    throughputMbps: wallSec > 0 ? (bytes * 8) / 1e6 / wallSec : 0,
    avg: durs.length ? durs.reduce((a, b) => a + b, 0) / durs.length : NaN,
    min: durs[0],
    p50: percentile(durs, 50),
    p90: percentile(durs, 90),
    p95: percentile(durs, 95),
    p99: percentile(durs, 99),
    max: durs[durs.length - 1],
    wallSec,
    aborted,
    byStatus,
    byRoute,
  }
}

// ----------------------------------------------------------------------------- reporting
function printStageRow(s) {
  const slo = s.p95 <= cfg.p95Slo && s.errorPct <= cfg.errorSlo && !s.aborted
  const mark = s.aborted ? "⨯ ABORT" : slo ? "✓ pass" : "✗ FAIL"
  console.log(
    `  ${String(s.vus).padStart(5)} | ${fmt(s.rps).padStart(8)} | ${fmt(s.p50).padStart(7)} | ${fmt(s.p95).padStart(8)} | ` +
      `${fmt(s.p99).padStart(8)} | ${fmt(s.errorPct, 2).padStart(7)}% | ${mark}`,
  )
}

function printHelp() {
  console.log(`
qc scalability load test

Usage:
  node loadtest/scalability.mjs [--url URL] [options]

Options:
  --url URL              Target base URL (default http://localhost:3000)
  --stages 10,50,100     Concurrent-VU levels to test (default 10,25,50,100,200,400)
  --duration 20          Seconds per stage (default 20)
  --warmup 5             Warmup seconds before timing (default 5, 0 disables)
  --cooldown 3           Seconds between stages (default 3)
  --think-min 0.5        Min think time between a VU's requests, seconds (default 0.5)
  --think-max 2.0        Max think time between a VU's requests, seconds (default 2.0)
  --timeout 30           Per-request timeout, seconds (default 30)
  --p95-slo 1000         p95 latency SLO in ms used to judge pass/fail (default 1000)
  --error-slo 1          Error-rate SLO in percent (default 1)
  --abort-error-pct 50   Abort a stage if error rate exceeds this (default 50)
  --routes "/:5,/blogs"  Custom weighted route mix ("path:weight", weight optional)
  --soq-routes "/soq/p/t" Gated SoQ content routes (only used together with --cookie)
  --cookie "sb-...=..."  Auth cookie header for testing gated routes
  --no-redirects         Measure redirects (3xx) instead of following them
  --yes                  Confirm you are authorised to test a non-local target
  --out DIR              Output directory for JSON/MD reports (default loadtest/results)

Only test infrastructure you own or are authorised to test.
`)
}

// ----------------------------------------------------------------------------- main
async function main() {
  console.log("\n" + "=".repeat(78))
  console.log(" QC FRONTEND — SCALABILITY / CAPACITY TEST")
  console.log("=".repeat(78))
  console.log(` Target        : ${cfg.url}  ${isLocal ? "(local)" : "(REMOTE — authorised)"}`)
  console.log(` Stages (VUs)  : ${cfg.stages.join(", ")}`)
  console.log(` Per stage     : ${cfg.duration}s   think time ${cfg.thinkMin}-${cfg.thinkMax}s   timeout ${cfg.timeout / 1000}s`)
  console.log(` SLO           : p95 <= ${cfg.p95Slo}ms  AND  errors <= ${cfg.errorSlo}%`)
  console.log(` Routes        : ${cfg.routes.map((r) => `${r.path}(${r.weight})`).join("  ")}`)
  console.log(` Auth cookie   : ${cfg.cookie ? "yes" : "no"}     redirects: ${cfg.followRedirects ? "follow" : "manual"}`)
  console.log("=".repeat(78) + "\n")

  // Connectivity check
  process.stdout.write(" Pre-flight check… ")
  const probe = await timedRequest("/")
  if (probe.status === "error") {
    console.log("FAILED")
    console.error(`\n✖ Could not reach ${cfg.url} (${probe.err}).`)
    console.error("  Start the app first (e.g. `pnpm build && pnpm start`) or fix --url.\n")
    process.exit(1)
  }
  console.log(`OK (/ → ${probe.status}, ${fmt(probe.ms)}ms)\n`)

  // Warmup (populate ISR/caches, open connections) — not measured.
  if (cfg.warmup > 0) {
    process.stdout.write(` Warming up ${cfg.warmup}s… `)
    const end = now() + cfg.warmup * 1000
    while (now() < end) await timedRequest(pickRoute())
    console.log("done\n")
  }

  console.log("    VUs |  req/s   |  p50 ms | p95 ms   | p99 ms   | errors  | verdict")
  console.log("  " + "-".repeat(72))

  const results = []
  let capacity = 0
  let peakRps = 0
  for (const vus of cfg.stages) {
    const s = await runStage(vus)
    results.push(s)
    printStageRow(s)
    peakRps = Math.max(peakRps, s.rps)
    const passed = s.p95 <= cfg.p95Slo && s.errorPct <= cfg.errorSlo && !s.aborted
    if (passed) capacity = vus
    // Stop ramping once the server is past its knee (failing or aborting).
    if (!passed) {
      console.log("\n  → SLO breached / server saturated; stopping ramp.")
      break
    }
    if (cfg.cooldown > 0) await sleep(cfg.cooldown * 1000)
  }

  printSummary(results, capacity, peakRps)
  writeReports(results, capacity, peakRps)
}

function printSummary(results, capacity, peakRps) {
  const worstRoute = findFirstSaturatingRoute(results)
  console.log("\n" + "=".repeat(78))
  console.log(" RESULTS")
  console.log("=".repeat(78))
  if (capacity > 0) {
    console.log(` ✓ Sustained within SLO up to ~${capacity} concurrent users`)
    console.log(`   (with ${cfg.thinkMin}-${cfg.thinkMax}s think time; p95 ≤ ${cfg.p95Slo}ms, errors ≤ ${cfg.errorSlo}%)`)
  } else {
    console.log(` ✗ The site did not meet the SLO even at the lowest stage (${cfg.stages[0]} VUs).`)
  }
  console.log(` • Peak throughput observed : ${fmt(peakRps)} req/s`)
  if (worstRoute) console.log(` • First route to degrade   : ${worstRoute.path} (p95 ${fmt(worstRoute.p95)}ms, ${fmt(worstRoute.errPct, 2)}% errors)`)
  console.log(`\n Interpreting "concurrent users": a VU loops request → think → request. With your`)
  console.log(` think time, ${capacity || cfg.stages[0]} VUs ≈ ${capacity || cfg.stages[0]} simultaneously-active browsers. Real traffic is`)
  console.log(` burstier, so treat this as an order-of-magnitude capacity, not an exact ceiling.`)
  console.log("=".repeat(78) + "\n")
}

function findFirstSaturatingRoute(results) {
  // Look at the first failing/last stage and report the route with the worst p95.
  const last = results[results.length - 1]
  if (!last) return null
  let worst = null
  for (const [path, r] of Object.entries(last.byRoute)) {
    if (!worst || r.p95 > worst.p95) worst = { path, p95: r.p95, errPct: r.errPct }
  }
  return worst
}

function writeReports(results, capacity, peakRps) {
  mkdirSync(cfg.outDir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, "-")
  const jsonPath = join(cfg.outDir, `scalability-${ts}.json`)
  const mdPath = join(cfg.outDir, `scalability-${ts}.md`)

  writeFileSync(jsonPath, JSON.stringify({ config: cfg, capacity, peakRps, stages: results }, null, 2))

  const rows = results
    .map(
      (s) =>
        `| ${s.vus} | ${fmt(s.rps)} | ${fmt(s.p50)} | ${fmt(s.p95)} | ${fmt(s.p99)} | ${fmt(s.errorPct, 2)}% | ${
          s.aborted ? "abort" : s.p95 <= cfg.p95Slo && s.errorPct <= cfg.errorSlo ? "pass" : "fail"
        } |`,
    )
    .join("\n")

  const md = `# Scalability test — ${cfg.url}

**Run:** ${new Date().toISOString()}
**SLO:** p95 ≤ ${cfg.p95Slo}ms and errors ≤ ${cfg.errorSlo}%  ·  think time ${cfg.thinkMin}–${cfg.thinkMax}s

## Verdict
- **Sustained concurrent users (within SLO): ~${capacity || "0"}**
- Peak throughput observed: **${fmt(peakRps)} req/s**

## Stages
| VUs | req/s | p50 ms | p95 ms | p99 ms | errors | verdict |
|----:|------:|-------:|-------:|-------:|-------:|:--------|
${rows}

> Generated by \`loadtest/scalability.mjs\`. Capacity is modelled with synthetic think time;
> validate against real production traffic patterns before relying on it for provisioning.
`
  writeFileSync(mdPath, md)
  console.log(` Reports written:\n   ${jsonPath}\n   ${mdPath}\n`)
}

main().catch((e) => {
  console.error("\nUnexpected error:", e)
  process.exit(1)
})
