// k6 load test for the Summer of Quant flow.
//
// Goal: answer "can it handle ~2000 people at once?" by exercising the REAL bottlenecks a
// logged-in SoQ user hits — Supabase Auth, Supabase PostgREST/DB + RLS, and Vercel SSR —
// at sustained 2000-VU concurrency.
//
// Strategy (approach A): a pre-seeded pool of test users is logged in ONCE in setup() to get
// JWTs; the 2000 VUs then REUSE those tokens. This measures true capacity without storming
// the auth endpoint 2000x (which would just hit Supabase's auth rate limiter). Seed the pool
// first with seed-users.mjs, and delete it afterwards with cleanup-users.mjs.
//
// Run a safe dry-run first, then the real thing:
//   k6 run -e BASE_URL=https://app... -e SUPABASE_URL=https://xxx.supabase.co \
//          -e SUPABASE_ANON_KEY=eyJ... -e VUS=50  soq-load-test.js     # dry run
//   k6 run ... -e VUS=2000 -e RAMP=2m -e HOLD=5m  soq-load-test.js     # the real test
//
// Requires the k6 binary (https://k6.io/docs/get-started/installation/). Not run by Node.

import http from "k6/http"
import { check, sleep, group, fail } from "k6"
import { Trend, Rate } from "k6/metrics"
import { b64encode } from "k6/encoding"

// ---- config (all via -e env) ----
const BASE_URL = (__ENV.BASE_URL || "").replace(/\/$/, "")
const SUPABASE_URL = (__ENV.SUPABASE_URL || "").replace(/\/$/, "")
const ANON_KEY = __ENV.SUPABASE_ANON_KEY || ""
const VUS = Number(__ENV.VUS || 50)
const RAMP = __ENV.RAMP || "2m"
const HOLD = __ENV.HOLD || "5m"
const POOL_FILE = __ENV.POOL_FILE || "./users.json"
const HIT_PAGES = (__ENV.HIT_PAGES || "true") === "true" // also GET the Next SSR pages
const THINK = Number(__ENV.THINK || 1) // seconds of think-time between iterations

if (!SUPABASE_URL || !ANON_KEY) {
  fail("Set -e SUPABASE_URL and -e SUPABASE_ANON_KEY")
}
if (HIT_PAGES && !BASE_URL) {
  fail("HIT_PAGES is on but BASE_URL is unset — set -e BASE_URL or -e HIT_PAGES=false")
}

// Supabase project ref = first label of the hostname (xxxx.supabase.co -> xxxx).
const PROJECT_REF = SUPABASE_URL.replace(/^https?:\/\//, "").split(".")[0]
const AUTH_COOKIE = `sb-${PROJECT_REF}-auth-token`

// Pool credentials, loaded once in init context.
const POOL = JSON.parse(open(POOL_FILE))

// ---- custom metrics (drive the thresholds / summary) ----
const loginLatency = new Trend("login_latency", true)
const structureLatency = new Trend("structure_latency", true)
const contentLatency = new Trend("content_latency", true)
const progressReadLatency = new Trend("progress_read_latency", true)
const progressWriteLatency = new Trend("progress_write_latency", true)
const pageLatency = new Trend("page_latency", true)
const errors = new Rate("errors")
const authedPageRendered = new Rate("authed_page_rendered") // /soq returned 200 (not 307→login)

// STAGES="100:20s,100:30s,250:20s,250:30s,..." overrides the default single ramp+hold,
// e.g. for a staircase that steps through load levels to find the knee.
function buildStages() {
  if (__ENV.STAGES) {
    return __ENV.STAGES.split(",").map(function (part) {
      const bits = part.split(":")
      return { target: Number(bits[0]), duration: bits[1] }
    })
  }
  return [
    { duration: RAMP, target: VUS }, // ramp up to full load
    { duration: HOLD, target: VUS }, // hold at full load
    { duration: "30s", target: 0 }, // ramp down
  ]
}

export const options = {
  scenarios: {
    soq: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: buildStages(),
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"], // <1% failed requests overall
    errors: ["rate<0.01"],
    structure_latency: ["p(95)<800"],
    content_latency: ["p(95)<800"],
    progress_read_latency: ["p(95)<800"],
    progress_write_latency: ["p(95)<1000"],
    page_latency: ["p(95)<2000"],
  },
}

// Build request headers. `extra` is merged without object-spread, which k6's bundled
// Babel doesn't accept inside object literals.
function headers(token, extra) {
  const h = { apikey: ANON_KEY, Authorization: `Bearer ${token}` }
  if (extra) {
    for (const k in extra) h[k] = extra[k]
  }
  return h
}
function anonHeaders() {
  return headers(ANON_KEY)
}
function userHeaders(token) {
  return headers(token)
}

// Build the @supabase/ssr session cookie so the Next middleware/server client treats the VU
// as logged in when we GET the gated pages. Best-effort: if the cookie format ever drifts,
// /soq simply 307s to login (visible via authed_page_rendered) — the PostgREST metrics above
// remain the authoritative capacity signal.
const BROWSER_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

// @supabase/ssr (v0.9) stores the session as "base64-" + base64url(JSON), unpadded.
// k6 "rawurl" = base64url without padding, matching its decoder exactly. Sent as an
// explicit Cookie header — k6's `cookies` param proved unreliable for this large value.
function cookieHeader(session) {
  return AUTH_COOKIE + "=base64-" + b64encode(JSON.stringify(session), "rawurl")
}

// ---- setup(): log the pool in once, fetch the published structure, hand both to the VUs ----
export function setup() {
  const sessions = []
  for (const u of POOL) {
    const res = http.post(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      JSON.stringify({ email: u.email, password: u.password }),
      { headers: headers(ANON_KEY, { "Content-Type": "application/json" }), tags: { name: "login" } },
    )
    loginLatency.add(res.timings.duration)
    if (res.status !== 200) {
      console.error(`login failed for ${u.email}: HTTP ${res.status} ${res.body}`)
      continue
    }
    const body = res.json()
    sessions.push({
      token: body.access_token,
      userId: body.user && body.user.id,
      // full session object as supabase-js would persist it (used to build the SSR cookie)
      session: body,
    })
  }
  if (sessions.length === 0) fail("No pool users could log in — run seed-users.mjs first")

  // Published phases + topics (the public structure query the app runs), flattened to topics.
  const sres = http.get(
    `${SUPABASE_URL}/rest/v1/soq_phases?select=id,slug,soq_topics(id,slug,is_published)&is_published=eq.true&order=order_index.asc`,
    { headers: anonHeaders(), tags: { name: "structure" } },
  )
  const topics = []
  if (sres.status === 200) {
    for (const p of sres.json()) {
      for (const t of p.soq_topics || []) {
        if (t.is_published !== false) topics.push({ id: t.id, slug: t.slug, phaseSlug: p.slug })
      }
    }
  }
  console.log(`setup: ${sessions.length} sessions, ${topics.length} published topics`)
  return { sessions, topics }
}

// ---- per-VU iteration: one realistic SoQ session ----
export default function (data) {
  const { sessions, topics } = data
  const s = sessions[(__VU - 1) % sessions.length]
  const topic = topics.length ? topics[Math.floor(Math.random() * topics.length)] : null

  // 1) Public structure read (phases + topics) — what /soq renders from.
  group("structure", () => {
    const res = http.get(
      `${SUPABASE_URL}/rest/v1/soq_phases?select=*,soq_topics(*)&is_published=eq.true&soq_topics.is_published=eq.true&order=order_index.asc`,
      { headers: anonHeaders(), tags: { name: "structure" } },
    )
    structureLatency.add(res.timings.duration)
    errors.add(res.status !== 200)
    check(res, { "structure 200": (r) => r.status === 200 })
  })

  // 2) Authed reads — the user's progress (landing) and a topic's content (topic page).
  group("authed-reads", () => {
    const prog = http.get(
      `${SUPABASE_URL}/rest/v1/soq_progress?select=topic_id&user_id=eq.${s.userId}`,
      { headers: userHeaders(s.token), tags: { name: "progress_read" } },
    )
    progressReadLatency.add(prog.timings.duration)
    errors.add(prog.status !== 200)
    check(prog, { "progress read 200": (r) => r.status === 200 })

    if (topic) {
      const content = http.get(
        `${SUPABASE_URL}/rest/v1/soq_content?select=*&topic_id=eq.${topic.id}`,
        {
          headers: headers(s.token, { Accept: "application/vnd.pgrst.object+json" }),
          tags: { name: "content_read" },
        },
      )
      contentLatency.add(content.timings.duration)
      // 200 = found, 406 = no content row yet (acceptable, not a capacity error).
      errors.add(content.status !== 200 && content.status !== 406)
      check(content, { "content read ok": (r) => r.status === 200 || r.status === 406 })
    }
  })

  // 3) Progress write — mark the topic complete (idempotent upsert), as the app does.
  if (topic) {
    group("progress-write", () => {
      const res = http.post(
        `${SUPABASE_URL}/rest/v1/soq_progress?on_conflict=user_id,topic_id`,
        JSON.stringify({ user_id: s.userId, topic_id: topic.id }),
        {
          headers: headers(s.token, {
            "Content-Type": "application/json",
            Prefer: "resolution=ignore-duplicates,return=minimal",
          }),
          tags: { name: "progress_write" },
        },
      )
      progressWriteLatency.add(res.timings.duration)
      errors.add(res.status >= 300)
      check(res, { "progress write <300": (r) => r.status < 300 })
    })
  }

  // 4) Next SSR pages — the actual rendered experience (login page + gated /soq with session).
  if (HIT_PAGES && BASE_URL) {
    group("pages", () => {
      const login = http.get(`${BASE_URL}/soq/login`, {
        headers: { "User-Agent": BROWSER_UA },
        tags: { name: "page_login" },
      })
      pageLatency.add(login.timings.duration)
      errors.add(login.status !== 200)

      // Gated landing with the constructed session cookie. redirects:0 so we can tell a real
      // authed render (200) from a bounce to login (307).
      const soq = http.get(`${BASE_URL}/soq`, {
        headers: { "User-Agent": BROWSER_UA, Cookie: cookieHeader(s.session) },
        redirects: 0,
        tags: { name: "page_soq" },
      })
      pageLatency.add(soq.timings.duration)
      authedPageRendered.add(soq.status === 200)
      // 200 (rendered) or 307 (cookie not honored) are both "server responded"; 5xx is the failure.
      errors.add(soq.status >= 500)
      check(soq, { "/soq not 5xx": (r) => r.status < 500 })

      if (topic && soq.status === 200) {
        const topicPage = http.get(`${BASE_URL}/soq/${topic.phaseSlug}/${topic.slug}`, {
          headers: { "User-Agent": BROWSER_UA, Cookie: cookieHeader(s.session) },
          redirects: 0,
          tags: { name: "page_topic" },
        })
        pageLatency.add(topicPage.timings.duration)
        errors.add(topicPage.status >= 500)
      }
    })
  }

  sleep(THINK)
}
