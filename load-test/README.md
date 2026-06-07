# SoQ load test — "can it handle ~2000 people at once?"

Drives the **Summer of Quant** flow at sustained 2000-VU concurrency to find where it breaks:
Supabase Auth, Supabase PostgREST/DB + RLS, and Vercel SSR.

**Approach:** a small pool of throwaway test users is seeded once, logged in once (in k6
`setup()`), and the 2000 virtual users **reuse those JWTs**. This measures real capacity
without firing 2000 signups/logins at Supabase (which would just hit its auth rate limiter and
pollute prod with 2000 users). The pool is deleted afterwards.

## ⚠️ Running against production

You picked **prod + full auth flow**. Do this deliberately:

- **Maintenance window.** 2000 concurrent VUs is real traffic — it can hit Vercel's function
  concurrency limit, incur Supabase/Vercel cost, and look like an attack. Tell anyone who'd
  page on the alerts.
- **Raise limits if needed.** Check Vercel function concurrency and Supabase compute/pooler
  size for your plan before the real run.
- **Always dry-run first** at `VUS=50` to validate the script, then scale to 2000.
- The pool reuses tokens, so Supabase **auth rate limits are not exercised** here. If you also
  want to test signup/login throughput, that's a separate, rate-aware test — ask and I'll add it.

## Prerequisites

1. **k6** — https://k6.io/docs/get-started/installation/ (e.g. `brew install k6`, `sudo pacman -S k6`, or the Docker image). The `*.mjs` scripts run on **Node 18+**.
2. Values to hand in:
   - `BASE_URL` — the deployed Next app, e.g. `https://qc-frontend.vercel.app`
   - `SUPABASE_URL` — `https://<ref>.supabase.co`
   - `SUPABASE_ANON_KEY` — public anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `SUPABASE_SERVICE_ROLE_KEY` — **service role** key (seed/cleanup only; never goes to k6)

## 1. Seed the test-user pool (once)

```bash
cd qc-frontend/load-test
SUPABASE_URL=https://xxxx.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJ...service-role... \
POOL_SIZE=50 \
node seed-users.mjs
```

Writes `users.json` (50 `loadtest+<n>@example.com` credentials). Idempotent — safe to re-run.

## 2. Dry-run (validate the script — do this first)

```bash
k6 run \
  -e BASE_URL=https://xxxx.vercel.app \
  -e SUPABASE_URL=https://xxxx.supabase.co \
  -e SUPABASE_ANON_KEY=eyJ...anon... \
  -e VUS=50 -e RAMP=30s -e HOLD=1m \
  soq-load-test.js
```

Confirm requests succeed and `authed_page_rendered` is ~1.0 (the session cookie is being
honored, so `/soq` renders instead of bouncing to login).

## 3. The real test — 2000 concurrent

```bash
k6 run \
  -e BASE_URL=https://xxxx.vercel.app \
  -e SUPABASE_URL=https://xxxx.supabase.co \
  -e SUPABASE_ANON_KEY=eyJ...anon... \
  -e VUS=2000 -e RAMP=2m -e HOLD=5m \
  soq-load-test.js
```

Ramps 0→2000 over 2 min, holds 5 min, ramps down.

## 4. Clean up (delete the test users + their progress rows)

```bash
SUPABASE_URL=https://xxxx.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJ...service-role... \
node cleanup-users.mjs
```

## What it exercises (the real SoQ queries)

| Step | Request | Auth |
|---|---|---|
| structure | `GET /rest/v1/soq_phases?select=*,soq_topics(*)&is_published=eq.true…` | anon |
| progress read | `GET /rest/v1/soq_progress?select=topic_id&user_id=eq.<uid>` | user JWT |
| content read | `GET /rest/v1/soq_content?select=*&topic_id=eq.<id>` (single) | user JWT |
| progress write | `POST /rest/v1/soq_progress?on_conflict=user_id,topic_id` (idempotent upsert) | user JWT |
| pages | `GET /soq/login`, `GET /soq`, `GET /soq/<phase>/<topic>` (with session cookie) | cookie |

## Reading the results

Pass/fail **thresholds** (k6 exits non-zero if any are breached — tune in `options.thresholds`):

- `http_req_failed < 1%` and `errors < 1%` — overall reliability
- `structure_latency`, `content_latency`, `progress_read_latency` p95 `< 800ms`
- `progress_write_latency` p95 `< 1000ms`
- `page_latency` p95 `< 2000ms`

Also watch in the summary:
- **`authed_page_rendered`** — should be ~1.0. If it drops, the `@supabase/ssr` cookie format
  drifted and `/soq` is bouncing to login; the **PostgREST metrics are still authoritative**
  for backend capacity (they use the bearer token directly, not the cookie).
- Per-request breakdown by the `name` tag (`login`, `structure`, `content_read`,
  `progress_write`, `page_soq`, …).

## Knobs (env)

| Var | Default | Meaning |
|---|---|---|
| `VUS` | `50` | peak concurrent virtual users (set `2000` for the real run) |
| `RAMP` / `HOLD` | `2m` / `5m` | ramp-up and steady-state durations |
| `THINK` | `1` | seconds of think-time between iterations |
| `HIT_PAGES` | `true` | also GET the Next SSR pages (set `false` to test Supabase only) |
| `POOL_SIZE` | `50` | (seed) number of test users to create |
| `POOL_FILE` | `./users.json` | credentials file shared by seed + k6 |
| `EMAIL_PREFIX` / `EMAIL_DOMAIN` | `loadtest+` / `example.com` | test-user email pattern (must match between seed + cleanup) |
| `TEST_PASSWORD` | `Loadtest!2000` | (seed) password for the pool |

## Files

- `seed-users.mjs` — create the pool → `users.json`
- `soq-load-test.js` — the k6 scenario
- `cleanup-users.mjs` — delete the pool + progress rows
