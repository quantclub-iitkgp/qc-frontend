# Load & scalability testing

Tools to answer **"how many concurrent users can the site handle?"** by ramping load in
stages and finding the point where latency or error rate breaches your SLO (the *knee*).

Two equivalent harnesses:

| Tool | When to use | Install |
|---|---|---|
| `scalability.mjs` | Anytime — zero dependencies | none (Node ≥ 20) |
| `k6-scalability.js` | More accurate concurrency + stats | [install k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) |

> ⚠️ **Only test infrastructure you own or are explicitly authorised to test.** Load testing a
> service without permission is abusive (effectively a denial-of-service). Both scripts default
> to `localhost`; the Node script refuses any non-local target unless you pass `--yes`.

---

## 0. Test a *production* build, not `pnpm dev`

`pnpm dev` is unoptimized (no minification, on-demand compilation) and will give meaningless
numbers. Always test a production build:

```bash
# build once, with the real Supabase env vars set
pnpm build
pnpm start                 # serves on http://localhost:3000
```

For results that reflect production, run the test against a deployed preview/staging instance
that mirrors prod (same region, same Supabase plan), since DB latency dominates dynamic routes.

---

## 1. Node script (no install)

```bash
# default ramp: 10 → 25 → 50 → 100 → 200 → 400 VUs, 20s each, against localhost:3000
node loadtest/scalability.mjs

# custom target + ramp
node loadtest/scalability.mjs --url http://localhost:3000 --stages 25,50,100,200,500 --duration 30

# stricter SLO (p95 under 500ms, errors under 0.5%)
node loadtest/scalability.mjs --p95-slo 500 --error-slo 0.5

node loadtest/scalability.mjs --help    # all options
```

It prints a per-stage table and a verdict, and writes JSON + Markdown reports to
`loadtest/results/`.

## 2. k6 (recommended if available)

```bash
BASE_URL=http://localhost:3000 k6 run loadtest/k6-scalability.js
```

Watch the live stats: the highest VU stage where the thresholds stay green is your capacity.

---

## 3. Testing the gated `/soq/[phase]/[topic]` content

Those routes require an authenticated **and enrolled** user (middleware redirects anonymous
requests to `/soq/login`). To load test the real content path, supply a logged-in session
cookie:

1. Log in to the site in your browser as an enrolled user.
2. DevTools → **Application → Cookies** → copy the Supabase auth cookies (names start with
   `sb-`). Join them into one header string: `sb-...-auth-token=...; sb-...-auth-token.0=...`.
3. Pass them, plus the concrete topic paths to hit:

```bash
# Node
node loadtest/scalability.mjs \
  --cookie "sb-xxxx-auth-token=...; sb-xxxx-auth-token.1=..." \
  --soq-routes "/soq/phase-1/intro,/soq/phase-1/markets"

# k6
BASE_URL=http://localhost:3000 \
COOKIE="sb-xxxx-auth-token=...; sb-xxxx-auth-token.1=..." \
SOQ_ROUTES="/soq/phase-1/intro,/soq/phase-1/markets" \
k6 run loadtest/k6-scalability.js
```

> Tokens expire — grab a fresh cookie right before a run. Treat the cookie as a secret; don't
> commit it.

---

## 4. Reading the results

```
    VUs |  req/s   |  p50 ms | p95 ms   | p99 ms   | errors  | verdict
  -------------------------------------------------------------------------
     50 |    612.0 |    41.0 |     88.0 |    120.0 |    0.00% | ✓ pass
    100 |   1180.0 |    52.0 |    140.0 |    260.0 |    0.10% | ✓ pass
    200 |   1320.0 |   160.0 |   1450.0 |   3200.0 |    2.40% | ✗ FAIL   ← knee here
```

- **Capacity** = the highest VU stage that passed the SLO (here ~100 users).
- **Peak throughput** = max `req/s` seen — your raw request ceiling.
- **First route to degrade** (in the summary) tells you *what* to optimise next; on this app
  the dynamic, Supabase-backed routes (`/`, `/soq/*`) saturate before static ones.

The default SLO is `p95 ≤ 1000ms` and `errors ≤ 1%`. Tune with `--p95-slo` / `--error-slo`
(Node) or the `thresholds` block (k6) to match your own targets.

### "Concurrent users" vs "requests/sec"
A virtual user loops: *request → think (0.5–2s) → request*. So 100 VUs ≈ 100 simultaneously
active browsers, **not** 100 req/s. Lower the think time to stress the backend harder; raise it
to model lighter browsing. State your think-time assumption when you report a capacity number.

---

## 5. Caveats

- **Load generator limits.** One laptop can't generate enough load to saturate a real cluster,
  and its own CPU/file-descriptors may cap you first. For >1–2k VUs use k6 from a machine close
  to the target (or distributed/k6 Cloud).
- **Caches warm up.** With the ISR/`unstable_cache` work in this repo, the first requests are
  cold (DB hit) and later ones are warm. The script warms up before measuring; for cold-start
  numbers run with `--warmup 0`.
- **You're also testing Supabase.** Dynamic routes hit the database — a low ceiling may be your
  Supabase plan/connection limit, not Next.js. Watch the Supabase dashboard during the run.
- **Rate limits / WAF.** Hosting providers may throttle or block burst traffic; a sudden wall of
  errors can be the platform protecting itself, not the app failing.
