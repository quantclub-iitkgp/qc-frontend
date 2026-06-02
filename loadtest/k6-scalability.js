/**
 * k6-scalability.js — capacity test for the QC frontend using k6 (https://k6.io).
 *
 * k6 models concurrency more accurately than a Node script (dedicated VU scheduler, rich
 * percentile stats). Use this when k6 is installed; otherwise use scalability.mjs.
 *
 *   # public routes against a local production build
 *   BASE_URL=http://localhost:3000 k6 run loadtest/k6-scalability.js
 *
 *   # include gated SoQ content (paste the auth cookie from your logged-in browser)
 *   BASE_URL=http://localhost:3000 \
 *   COOKIE="sb-access-token=...; sb-refresh-token=..." \
 *   SOQ_ROUTES="/soq/phase-1/intro,/soq/phase-1/markets" \
 *   k6 run loadtest/k6-scalability.js
 *
 * ⚠️  Only run against infrastructure you own or are explicitly authorised to test.
 */
import http from "k6/http"
import { check, sleep, group } from "k6"
import { Rate, Trend } from "k6/metrics"

const BASE_URL = (__ENV.BASE_URL || "http://localhost:3000").replace(/\/$/, "")
const COOKIE = __ENV.COOKIE || ""
const SOQ_ROUTES = (__ENV.SOQ_ROUTES || "").split(",").map((s) => s.trim()).filter(Boolean)

// Weighted public route mix; gated routes added only when a cookie is supplied.
const ROUTES = [
  { path: "/", weight: 5, name: "home" },
  { path: "/soq", weight: 4, name: "soq_landing" },
  { path: "/blogs", weight: 3, name: "blogs" },
  { path: "/whitepapers", weight: 2, name: "whitepapers" },
  { path: "/aboutus", weight: 1, name: "aboutus" },
  { path: "/soq/login", weight: 1, name: "soq_login" },
]
if (COOKIE && SOQ_ROUTES.length) {
  for (const p of SOQ_ROUTES) ROUTES.push({ path: p, weight: 3, name: "soq_content" })
}

const CUM = (() => {
  const total = ROUTES.reduce((s, r) => s + r.weight, 0)
  let acc = 0
  return ROUTES.map((r) => ({ ...r, cum: (acc += r.weight) / total }))
})()
function pickRoute() {
  const x = Math.random()
  for (const r of CUM) if (x <= r.cum) return r
  return CUM[CUM.length - 1]
}

// Per-route latency trends so you can see which route saturates first.
const routeTrends = {}
for (const r of ROUTES) routeTrends[r.name] = routeTrends[r.name] || new Trend(`rt_${r.name}`, true)
const errorRate = new Rate("route_errors")

export const options = {
  scenarios: {
    capacity_ramp: {
      executor: "ramping-vus",
      startVUs: 0,
      // Staircase: hold at each level so percentiles stabilise, then step up.
      stages: [
        { duration: "20s", target: 10 },
        { duration: "30s", target: 10 },
        { duration: "20s", target: 50 },
        { duration: "30s", target: 50 },
        { duration: "20s", target: 100 },
        { duration: "30s", target: 100 },
        { duration: "20s", target: 200 },
        { duration: "30s", target: 200 },
        { duration: "20s", target: 400 },
        { duration: "30s", target: 400 },
        { duration: "20s", target: 0 },
      ],
      gracefulRampDown: "10s",
    },
  },
  thresholds: {
    // The capacity SLO: tune to your own targets.
    http_req_duration: ["p(95)<1000", "p(99)<2500"],
    http_req_failed: ["rate<0.01"],
    route_errors: ["rate<0.01"],
  },
}

const params = {
  headers: {
    "User-Agent": "qc-k6-loadtest/1.0 (+authorised testing only)",
    ...(COOKIE ? { Cookie: COOKIE } : {}),
  },
  // follow redirects (realistic navigation); set to 0 to measure the 3xx itself
  redirects: 5,
}

export default function () {
  const route = pickRoute()
  group(route.name, () => {
    const res = http.get(BASE_URL + route.path, params)
    const ok = res.status >= 200 && res.status < 400
    check(res, { "status < 400": () => ok })
    errorRate.add(!ok)
    routeTrends[route.name].add(res.timings.duration)
  })
  // Think time: 0.5–2s between actions, like a real reader.
  sleep(0.5 + Math.random() * 1.5)
}

// Minimal text summary (avoids importing the remote k6 summary helper).
function textSummary(data) {
  const val = (metric, key) => {
    const m = data.metrics[metric]
    return m && m.values[key] !== undefined ? m.values[key] : NaN
  }
  const num = (v, d = 0) => (Number.isFinite(v) ? v.toFixed(d) : "—")
  return [
    "",
    "──────── capacity summary ────────",
    `  http_reqs (rate)      : ${num(val("http_reqs", "rate"), 1)} req/s`,
    `  http_req_duration p95 : ${num(val("http_req_duration", "p(95)"))} ms`,
    `  http_req_duration p99 : ${num(val("http_req_duration", "p(99)"))} ms`,
    `  http_req_failed       : ${num((val("http_req_failed", "rate") || 0) * 100, 2)} %`,
    "──────────────────────────────────",
    "",
  ].join("\n")
}

export function handleSummary(data) {
  const val = (metric, key) => {
    const m = data.metrics[metric]
    return m && m.values[key] !== undefined ? m.values[key] : NaN
  }
  const num = (v, d = 0) => (Number.isFinite(v) ? v.toFixed(d) : "—")
  const md = [
    "# k6 scalability summary",
    "",
    `- Target: ${BASE_URL}`,
    `- Requests/s (avg over run): ${num(val("http_reqs", "rate"), 1)}`,
    `- Overall p95: ${num(val("http_req_duration", "p(95)"))} ms`,
    `- Overall p99: ${num(val("http_req_duration", "p(99)"))} ms`,
    `- Error rate: ${num((val("http_req_failed", "rate") || 0) * 100, 2)} %`,
    "",
    "> Watch the k6 stdout during the run: the highest VU stage where the thresholds stay",
    "> green (no ✗) is your sustainable capacity.",
  ].join("\n")
  return {
    stdout: textSummary(data),
    "loadtest/results/k6-summary.json": JSON.stringify(data, null, 2),
    "loadtest/results/k6-summary.md": md,
  }
}
