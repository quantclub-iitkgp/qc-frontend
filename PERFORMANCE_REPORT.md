# SoQ Route Transition Performance Audit

**Scope:** `/soq`, `/soq/[phase]`, `/soq/[phase]/[topic]` (and the site-wide route-transition flow)
**Date:** 2026-06-02
**Stack:** Next.js 15.2.9 (App Router) · React 19 · Supabase · Tailwind v4 · framer-motion

---

## 1. Executive summary

Route transitions in `/soq` feel slow for **one dominant reason**: the entire SoQ section was deliberately made **fully dynamic with zero caching** (git: `perf(soq): drop unstable_cache so phase/topic edits appear instantly` + `render Supabase-backed pages dynamically for realtime admin updates`). As a result **every navigation re-runs a cascade of duplicated, uncached, partly-sequential Supabase round-trips on the server**, and because there is **no `loading.tsx`**, the browser shows *nothing* until that whole cascade finishes. A client-side `<Link>` click that should feel instant instead waits on ~8–15 server round-trips with no visual feedback.

The fix is not "turn caching back off." It's the pattern that was missing: **cache the public, rarely-changing course structure (tag-invalidated) + dedupe per-request fetches + stream an instant skeleton + move writes off the critical path + restore instant admin edits via on-demand `revalidateTag`.**

### Headline results (this PR)

| Metric | Before | After | Improvement |
|---|---|---|---|
| Server round-trips per topic navigation (warm) | ~8–15 | **~2–3** | **~70–80% fewer** |
| Redundant auth (`auth.getUser`) calls per nav | 3 | **2** (1 unavoidable middleware gate) | dedup |
| Duplicate `getAllPhasesWithTopics` (heavy join) per nav | 2× + uncached | **0 DB when warm** (cached) | eliminated |
| Blocking DB **write** in render path | 1 (`markTopicComplete`) | **0** (moved to post-paint action) | eliminated |
| Perceived navigation feedback | none (frozen old page) | **instant skeleton** (<100ms) | qualitative ✅ |
| SoQ structure freshness on admin edit | live (but uncached) | **instant** (via `revalidateTag`) **+ cached** | preserved |

Bundle numbers (real `next build` output) and the full waterfall model are in §4–§5.

---

## 2. Methodology — what was measured & how

| Requested measurement | How it was obtained | Confidence |
|---|---|---|
| **Bundle size / First Load JS** | Real `next build` route table (placeholder env). See §4. | **Measured** |
| **Network requests / waterfall** | Static analysis of the actual fetch graph across middleware → layout → page → `generateMetadata`. See §5. | **Derived from code** (exact request *count*; per-request latency modeled at ~80ms typical Supabase round-trip) |
| **Route transition time** | Modeled from waterfall × round-trip latency + absence of `loading.tsx`. | **Modeled estimate** |
| **API response time** | Per Supabase query; the issue is *count & duplication*, not single-query latency. | **Derived** |
| **Hydration / React render time** | Reasoned from client-component sizes (framer-motion baseline, landing page). | **Reasoned estimate** |
| **Lighthouse / Core Web Vitals** | Projected from bundle + render-blocking analysis. Live Lighthouse needs a deployed instance + Supabase creds (not available in this CI container). Labeled **estimated**. | **Projected estimate** |

> Honesty note: a *live* Lighthouse run and a real network HAR capture require a running app with valid Supabase credentials and a browser, which this environment does not have. Bundle sizes are **real build output**; latency/Lighthouse figures are **clearly-labeled models** derived from the code's request graph and standard Supabase/serverless latencies.

---

## 3. Root cause & all findings

### 🔴 #1 — Duplicated, uncached server data waterfall (THE bottleneck)

The layout, the page, **and** `generateMetadata` independently re-fetch the same data on every navigation. Concretely, one visit to `/soq/[phase]/[topic]` triggers:

```
middleware.ts            auth.getUser()                         ← auth round-trip #1
[phase]/layout.tsx       getCurrentUser() → auth.getUser()      ← auth round-trip #2 (dup)
                         getAllPhasesWithTopics()               ← phases+topics join
                         checkEnrollment(user)                  ← enrollments query
                         getUserProgress(user)                  ← progress query
[topic]/page.tsx         getCurrentUser() → auth.getUser()      ← auth round-trip #3 (dup)
                         getTopicContent()
                            → getPhaseWithTopics() = phase + topics queries (2)
                            → soq_content query (1)
                         getAllPhasesWithTopics()               ← DUPLICATE heavy join
                         checkEnrollment(user)                  ← DUPLICATE
                         markTopicComplete()                    ← BLOCKING DB WRITE
generateMetadata()       getTopicContent() = phase+topics+content (3)  ← DUPLICATE of page
```

**≈ 3 auth calls + ~11 DB reads + 1 write per navigation, none cached, several sequential.**

**Why it's slow:** `getAllPhasesWithTopics()` (a nested join over the whole course) runs **twice**; `getTopicContent()` runs **twice** (page + metadata), and each internally did a redundant `getPhaseWithTopics()` (2 more queries) even though the full structure was already fetched. `auth.getUser()` makes a **network call to Supabase Auth to validate the JWT** (not a local read) and fires **3×**. At a typical ~80ms/round-trip with only partial parallelism, that's **~700–1200ms of server time before the first byte** — and the user sees none of it because there's no loading UI.

**Fix (implemented):**
- Wrapped the public structure (`getAllPhasesWithTopics`, `getPublishedPhases`, `getPhaseWithTopics`) in **`unstable_cache` + tag `soq-structure`** → cached across requests, deduped within a request. The heavy join now costs **0 DB on a warm cache** and is shared by layout + page + metadata.
- Wrapped user-scoped helpers (`getCurrentUser`, `checkEnrollment`, `getUserProgress`, `getLastVisitedTopic`) in React **`cache()`** → per-request dedupe, so layout + page + metadata share **one** `auth.getUser()` and **one** enrollment query.
- Rewrote `getTopicContent` to derive topic metadata from the **cached** structure (0 queries) and only hit Supabase for the gated content body (1 query, RLS-enforced).

```ts
// BEFORE — re-runs on every request, no cache, 2 extra queries inside
export async function getAllPhasesWithTopics() { /* supabase join */ }
export async function getTopicContent(phaseSlug, topicSlug) {
  const phaseResult = await getPhaseWithTopics(phaseSlug)  // phase + topics queries
  const topic = phaseResult?.topics.find(t => t.slug === topicSlug)
  const supabase = await createClient()
  const { data } = await supabase.from("soq_content").select("*").eq("topic_id", topic.id).single()
  // ...
}

// AFTER — cross-request cache (tag-invalidated) + per-request dedupe
export const getAllPhasesWithTopics = unstable_cache(
  async () => { /* same supabase join */ },
  ["soq-all-phases-with-topics"],
  { tags: [SOQ_STRUCTURE_TAG], revalidate: 3600 },
)
export const getTopicContent = cache(async (phaseSlug, topicSlug) => {
  const all = await getAllPhasesWithTopics()                // cached → 0 DB when warm
  const topic = all.find(p => p.slug === phaseSlug)?.topics.find(t => t.slug === topicSlug)
  if (!topic) return null
  const supabase = await createClient()                     // only the gated body hits DB
  const { data } = await supabase.from("soq_content").select("*").eq("topic_id", topic.id).single()
  // ...
})
```

**Estimated improvement:** server round-trips on the critical path **~11 → ~2–3** (warm), TTFB on navigation **~700–1200ms → ~150–250ms** (**~70–80%**).

---

### 🔴 #2 — No `loading.tsx` ⇒ no instant feedback **and** prefetch is a no-op

For a **dynamic** route, Next's `<Link>` prefetch only warms the **`loading` boundary** (the static shell), not the dynamic payload. With **no `loading.tsx` anywhere under `/soq`**, prefetch had nothing to warm, so every click paid the full cold server render **while the browser kept showing the old page** (the classic "I clicked but nothing happened" feel).

**Fix (implemented):** added `src/app/soq/[phase]/loading.tsx` — a neobrutalist article skeleton. The sidebar (in the layout) stays mounted; only the content area shows the skeleton, which now (a) **renders instantly on click** and (b) is **prefetchable**, so transitions feel instant even before data arrives.

**Estimated improvement:** perceived transition latency **→ <100ms** (priority #1 met). LCP/INP on navigation materially improved.

---

### 🟠 #3 — Blocking DB **write** on the render path

```ts
// BEFORE — page render awaits a DB write before returning any HTML
if (enrolled && result) {
  const { markTopicComplete } = await import("@/lib/soq-api") // pointless dynamic import of an already-imported module
  await markTopicComplete(result.topic.id, user)              // upsert blocks the response
}
```

A topic is "auto-completed" by **awaiting an `upsert`** before rendering — so the reader waits on a write they don't care about. (The dynamic `import()` was also pointless: the module is already statically imported at the top.)

**Fix (implemented):** removed it from the page. Progress now persists via a **fire-and-forget server action** triggered by the existing `<TopicVisitTracker>` client effect **after paint**:

```tsx
// topic-visit-tracker.tsx (AFTER)
useEffect(() => {
  markVisited(topicId)               // optimistic local checkmark
  void markTopicCompleteAction(topicId) // persists server-side, off the critical path
}, [topicId, markVisited])
```

**Estimated improvement:** removes **1 blocking write (~80–150ms)** from every topic navigation; content paints sooner.

---

### 🟠 #4 — Site-wide `force-dynamic` defeats caching everywhere (recommended, **not applied**)

`/`, `/blogs`, `/blogs/[slug]`, `/whitepapers/[[...slug]]`, `/aboutus` are all `export const dynamic = "force-dynamic"` *purely* "so admin edits appear immediately." None read cookies/headers/`searchParams`, so they pay full dynamic rendering for zero dynamic reason — and the homepage is the heaviest route at **331 kB First Load JS**, re-rendered on every visit.

**Why not applied here:** I trialed converting them to tag-based ISR (`revalidate` + `unstable_cache`). It compiles, but **ISR routes are prerendered at build time**, so the build then requires Supabase (and Yahoo Finance, for the homepage) to be reachable *during the build*. With placeholder creds the build fails (`Export encountered an error on /aboutus`). `force-dynamic` was therefore *also* shielding the build from a build-time data dependency — flipping it could break the team's CI/deploy, which I can't verify here. The SoQ routes don't have this problem because they read auth cookies and are inherently dynamic (never prerendered).

**Recommended approach (safe, when you control the build env):** either (a) convert to ISR **and** ensure the build can reach Supabase, or (b) **keep `force-dynamic` but cache the data layer** — wrap `getBlogs/getWhitepapers/getEvents/getTeam` in `unstable_cache` with tags. Option (b) keeps the build Supabase-free (dynamic pages aren't prerendered) while still eliminating repeated Supabase round-trips at runtime; freshness is then restored via the revalidate endpoint (#5). Reverted from this PR to avoid touching deploy behavior outside the SoQ scope.

---

### 🟢 #5 — "Instant admin edits" preserved correctly (the missing piece)

The reason SoQ caching was originally dropped was a missing **on-demand invalidation** path. Added `POST /api/revalidate?tag=soq-structure` (secret-guarded, tag allowlist). Wire your admin save (or a Supabase DB webhook) to call it and SoQ phase/topic edits appear **instantly** — without making every visitor pay for an uncached re-query.

```
POST /api/revalidate?tag=soq-structure
header: x-revalidate-secret: $REVALIDATE_SECRET
```

> **Action required:** set `REVALIDATE_SECRET` in the environment and call this endpoint from the SoQ admin tooling after edits. Until wired, the cached structure auto-refreshes within the `revalidate` window (≤1h). The same endpoint is the mechanism #4 (option b) would reuse for blogs/whitepapers/team.

---

### 🟡 #6 — Heavy always-on animations on `/soq` landing (INP/CPU)

`soq-program-landing.tsx` runs ~10 **infinite** framer-motion loops (`ParticleBackground`, `AnimatedStar`, `FloatingIcon`) that animate forever regardless of visibility or user preference — main-thread cost that hurts INP.

**Fix (implemented):** all decorative loops now respect **`prefers-reduced-motion`** (particles skip rendering entirely; stars/icons render static). Accessibility + INP win with no visual change for default users.

---

### 🟡 #7 — framer-motion in the global baseline (101 kB shared First Load JS)

The root-layout **navbar is a client component importing framer-motion**, so framer-motion ships in the **shared First Load JS on every route** (~50 kB of the 101 kB baseline) — including otherwise-empty routes like `/soq/[phase]` (101 kB) and `/_not-found` (101 kB).

**Recommended (not applied — touches global UI, propose before changing):** replace the navbar's framer-motion usages (entrance, `layoutId` underline, mobile drawer) with CSS transitions/`@keyframes`. Removes ~50 kB from **every** route's First Load JS. See §6.

---

### Other checks (from the audit checklist)

| Checked | Verdict |
|---|---|
| Large client components | `soq-program-landing` (181 kB route) — mitigated via #6; further via #7. |
| Excessive `useEffect` | No — effects are minimal and correct. |
| Unnecessary re-renders / missing memo | Sidebar already memo-friendly; landing uses `useMemo` for particles. Fine. |
| Dynamic imports not used | `react-markdown`/`remark`/`rehype` correctly run **server-side** (`ContentRenderer` has no `"use client"`) — **not** shipped to the client. ✅ |
| Blocking data fetching | **Yes — #1, #3.** Fixed. |
| Large images | `next/config` already sets remote patterns + 7-day `minimumCacheTTL`; homepage event images use raw `<img>` (minor; could use `next/image`). |
| Heavy animations | **Yes — #6.** Fixed. |
| Suspense boundary issues | **Missing entirely — #2.** Fixed. |
| Server Component waterfalls | **Yes — #1.** Fixed (cache + dedupe). |
| N+1 API requests | The duplicated `getAllPhasesWithTopics`/`getTopicContent`/auth across layout+page+metadata — **#1.** Fixed. |
| Third-party scripts blocking render | PostHog has `next.config` rewrites but **no client init present** — not currently blocking. |

---

## 4. Bundle analysis (real `next build` output)

```
Route (app)                                 Size  First Load JS
┌ ƒ /                                    63.4 kB         331 kB   ← heaviest; was force-dynamic
├ ƒ /blogs/[slug]                         186 kB         448 kB   ← katex + chart + MDX (out of SoQ scope)
├ ƒ /soq                                 10.6 kB         181 kB   ← landing (framer-motion + decorations)
├ ƒ /soq/[phase]/[topic]                 1.88 kB         150 kB   ← content route
├ ƒ /soq/[phase]                           167 B         101 kB   ← redirect only (pure baseline)
└ + First Load JS shared by all           101 kB                 ← framer-motion (navbar) + React
    ├ chunks/…  45.8 kB        (React/runtime)
    └ chunks/…  53.3 kB        (framer-motion — from the root-layout navbar)
```

**Takeaways:** the **101 kB shared baseline** is paid on *every* route and is dominated by framer-motion pulled in via the navbar (#7). The SoQ content route itself is lean (1.88 kB); its slowness was **server-side data**, not client JS. The 448 kB `/blogs/[slug]` is a separate (out-of-scope) opportunity (katex CSS/JS + `BlogLineChart` + MDX).

---

## 5. Network waterfall analysis (per topic navigation)

```
BEFORE (no cache, no skeleton)                AFTER (cached + deduped + skeleton)
─────────────────────────────────────────    ─────────────────────────────────────────
click ──▶ (old page stays, nothing shown)     click ──▶ skeleton paints  ≈ <100ms  ✅
  middleware  auth.getUser ........ 80ms         middleware  auth.getUser ........ 80ms
  layout      auth.getUser ........ 80ms (dup)   tree        auth.getUser ........ 80ms (deduped: 1)
  layout      phases+topics ....... 80ms         structure   (unstable_cache) .... 0ms  (warm)
  layout      enrollment .......... 80ms         enrollment  ................... 80ms (deduped: 1)
  layout      progress ............ 80ms         progress    ................... 80ms
  page        auth.getUser ........ 80ms (dup)   content body ................. 80ms
  page        phase ............... 80ms (dup)   markComplete  → off critical path (post-paint)
  page        topics .............. 80ms (dup)
  page        content ............. 80ms        ── first byte ≈ 150–250ms; skeleton already shown
  page        phases+topics ....... 80ms (dup)
  page        enrollment .......... 80ms (dup)
  page        markComplete WRITE .. 120ms (blocking)
  metadata    phase+topics+content  3×80ms (dup)
── first byte ≈ 700–1200ms; user saw nothing the whole time
```

**Round-trips on the critical path: ~11–15 → ~2–4.** Combined with the prefetchable skeleton, perceived latency goes from "frozen for ~1s" to "instant."

---

## 6. Recommended follow-ups (not in this PR)

1. **#4 — Cache the `force-dynamic` content pages** (`/`, blogs, whitepapers, aboutus). Either move to ISR with a Supabase-reachable build, or keep `force-dynamic` + wrap the `api.ts` fetchers in `unstable_cache` (tags) so runtime stops re-querying Supabase on every visit. Restore freshness via the revalidate endpoint. (Trialed + reverted — see #4 for the build-time caveat.)
2. **#7 — Drop framer-motion from the navbar** (CSS entrance + `:after` underline + CSS drawer). Saves **~50 kB First Load JS on every route**. Touches shared UI, so proposing rather than forcing.
   ```tsx
   // BEFORE: <motion.nav initial={{y:-70,opacity:0}} animate={{y:0,opacity:1}} …>
   // AFTER:  <nav className="… animate-[slideDown_0.4s_ease-out]">   // @keyframes slideDown
   ```
3. **`/blogs/[slug]` (448 kB)** — lazy-load `katex` CSS and `BlogLineChart` (`next/dynamic`), only when the article contains math/charts.
4. **Reduce auth to 1 round-trip** — have `middleware.ts` forward the validated user id via a request header and read it in the tree instead of a second `auth.getUser()`.
5. **Homepage event images** — switch raw `<img>` to `next/image` for sizing/lazy-loading.

---

## 7. Files changed in this PR

| File | Change |
|---|---|
| `src/lib/soq-api.ts` | `unstable_cache` + tags for public structure; `cache()` dedupe for user data; `getTopicContent` no longer double-queries; `SOQ_STRUCTURE_TAG` export |
| `src/app/api/revalidate/route.ts` | **new** — secret-guarded on-demand `revalidateTag("soq-structure")` (instant admin edits) |
| `src/app/soq/[phase]/loading.tsx` | **new** — instant skeleton + prefetchable boundary |
| `src/app/soq/[phase]/[topic]/page.tsx` | removed blocking `markTopicComplete` write + pointless dynamic import |
| `src/app/soq/actions.ts` | **new action** `markTopicCompleteAction` (off-critical-path persistence) |
| `src/app/soq/_components/topic-visit-tracker.tsx` | fire-and-forget progress persistence |
| `src/app/soq/_components/soq-program-landing.tsx` | decorative animations respect `prefers-reduced-motion` |

> Trialed and **reverted** (see §3 #4): `force-dynamic` → ISR on `/`, blogs, whitepapers, aboutus, and `unstable_cache` on `src/lib/api.ts`. Kept out of this PR because ISR prerenders at build time and would add a build-time Supabase dependency.
