import { cache } from "react"
import { unstable_cache, revalidateTag } from "next/cache"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { getSupabaseClient } from "@/lib/supabase"
import { getServiceClient } from "@/lib/supabase/service"
import {
  withCache,
  invalidateUserProgress,
  cacheKey,
  TTL,
} from "@/lib/redis"

export type SoQPhase = {
  id: number
  slug: string
  title: string
  description?: string
  orderIndex: number
}

export type SoQTopic = {
  id: number
  phaseId: number
  slug: string
  title: string
  description?: string
  orderIndex: number
  readingTimeMinutes: number
}

export type SoQContent = {
  id: number
  topicId: number
  body: string
}

// Cache tag for all public, published SoQ structure (phases + topics). Admin tooling
// should POST /api/revalidate?tag=soq-structure after edits so changes appear instantly
// without forcing every visitor's navigation to re-query Supabase.
export const SOQ_STRUCTURE_TAG = "soq-structure"

// Cache tag for the SoQ topic bodies cached in getCachedContentByTopicId. Admin tooling
// should POST /api/revalidate?tag=soq-content after editing a topic's body so the change
// appears immediately instead of waiting out the revalidate window.
export const SOQ_CONTENT_TAG = "soq-content"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function phaseFromRow(row: any): SoQPhase {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    orderIndex: row.order_index,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function topicFromRow(row: any): SoQTopic {
  return {
    id: row.id,
    phaseId: row.phase_id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    orderIndex: row.order_index,
    readingTimeMinutes: row.reading_time_minutes ?? 10,
  }
}

export type SoQPhaseWithTopics = SoQPhase & { topics: SoQTopic[] }

export type SoQCourse = "beginner" | "advanced"

// Uncached inner read — reused inside the already-cached structure queries so a
// single cache miss does one settings round-trip and invalidates together.
async function readActiveCourse(): Promise<SoQCourse> {
  const { data } = await getSupabaseClient()
    .from("soq_settings")
    .select("active_course")
    .eq("id", true)
    .single()
  return data?.active_course === "advanced" ? "advanced" : "beginner"
}

// Cached variant for consumers that only need the active course (e.g. the sidebar label).
// Short TTL so an admin course switch propagates within ~a minute even WITHOUT the cross-app
// /api/revalidate bust (which needs QC_FRONTEND_URL + REVALIDATE_SECRET wired in both apps).
// ponytail: 60s propagation ceiling; set the revalidate env in both apps for instant switch.
export const getActiveCourse = unstable_cache(
  readActiveCourse,
  ["soq-active-course-v2"],
  { tags: [SOQ_STRUCTURE_TAG], revalidate: 60 },
)

// Structure keyed BY COURSE — `course` is part of the unstable_cache key, so flipping the
// active course is a cache MISS on the new course, never a stale HIT on the old one. This is
// the fix for "toggled the course but the site still shows the old one": a static cache key
// survives Vercel's cross-deploy Data Cache and only clears on tag-bust or the revalidate timer.
const getPhasesForCourse = unstable_cache(
  async (course: SoQCourse): Promise<SoQPhaseWithTopics[]> => {
    const { data, error } = await getSupabaseClient()
      .from("soq_phases")
      .select("*, soq_topics(*)")
      .eq("is_published", true)
      .eq("course", course)
      .eq("soq_topics.is_published", true)
      .order("order_index", { ascending: true })
      .order("order_index", { referencedTable: "soq_topics", ascending: true })
    if (error) throw new Error(error.message)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data ?? []).map((row: any) => ({
      ...phaseFromRow(row),
      topics: (row.soq_topics ?? []).map(topicFromRow),
    }))
  },
  ["soq-phases-by-course"],
  { tags: [SOQ_STRUCTURE_TAG], revalidate: 3600 },
)

// Public structure for the CURRENTLY ACTIVE course. Active-course lookup (short TTL) picks the
// course; the heavy phase+topics join is cached per course under a course-varying key.
export async function getAllPhasesWithTopics(): Promise<SoQPhaseWithTopics[]> {
  return getPhasesForCourse(await getActiveCourse())
}

// Uses anon client — phases are publicly readable (RLS: is_published = true).
export const getPublishedPhases = unstable_cache(
  async (): Promise<SoQPhase[]> => {
    const activeCourse = await readActiveCourse()
    const { data, error } = await getSupabaseClient()
      .from("soq_phases")
      .select("*")
      .eq("is_published", true)
      .eq("course", activeCourse)
      .order("order_index", { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []).map(phaseFromRow)
  },
  ["soq-published-phases"],
  { tags: [SOQ_STRUCTURE_TAG], revalidate: 3600 },
)

// Derived from the cached structure — no extra Supabase queries.
export const getPhaseWithTopics = cache(
  async (
    phaseSlug: string,
  ): Promise<{ phase: SoQPhase; topics: SoQTopic[] } | null> => {
    const all = await getAllPhasesWithTopics()
    const phase = all.find((p) => p.slug === phaseSlug)
    if (!phase) return null
    const { topics, ...phaseFields } = phase
    return { phase: phaseFields, topics }
  },
)

// A topic body is identical for every authenticated user (RLS: any authenticated user) and
// rarely changes, so it's cached globally per topic in Next's Data Cache rather than queried
// on every page view — this is what keeps content reads off the database under load. Access
// stays gated by middleware (the whole /soq area requires login); the service-role client is
// used only to bypass RLS for this cookie-free cached read (unstable_cache can't read cookies),
// never to widen who can see the data. unstable_cache keys on the topicId argument, so each
// topic gets its own entry; tag-invalidated on admin edit + hourly revalidate as a safety net.
const getCachedContentByTopicId = unstable_cache(
  async (topicId: number): Promise<SoQContent | null> => {
    const { data, error } = await getServiceClient()
      .from("soq_content")
      .select("id, topic_id, body")
      .eq("topic_id", topicId)
      .single()
    if (error || !data) return null
    return { id: data.id, topicId: data.topic_id, body: data.body }
  },
  ["soq-content-by-topic"],
  { tags: [SOQ_CONTENT_TAG], revalidate: 3600 },
)

// Topic metadata comes from the cached structure (0 queries); the body comes from the
// per-topic Data Cache above. Deduped per request so the page and generateMetadata share one
// lookup. Net DB cost of a content page view at steady state: 0 reads (everything cached).
export const getTopicContent = cache(
  async (
    phaseSlug: string,
    topicSlug: string,
  ): Promise<{ topic: SoQTopic; content: SoQContent | null } | null> => {
    const all = await getAllPhasesWithTopics()
    const phase = all.find((p) => p.slug === phaseSlug)
    const topic = phase?.topics.find((t) => t.slug === topicSlug)
    if (!topic) return null

    const content = await getCachedContentByTopicId(topic.id)
    return { topic, content }
  },
)

// Single source of truth for the current user — deduped per request so the layout, page,
// generateMetadata, and the user-scoped helpers below share one auth round-trip.
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

// Returns topic IDs the user has completed.
// Redis TTL: 5 min. Invalidated by markTopicComplete.
export const getUserProgress = cache(async (user?: User | null): Promise<number[]> => {
  const resolvedUser = user ?? (await getCurrentUser())
  if (!resolvedUser) return []

  return withCache(
    cacheKey.userProgress(resolvedUser.id),
    TTL.userProgress,
    async () => {
      const supabase = await createClient()
      const { data } = await supabase
        .from("soq_progress")
        .select("topic_id")
        .eq("user_id", resolvedUser.id)
      return (data ?? []).map((r: { topic_id: number }) => r.topic_id)
    },
  )
})

// Marks a topic as completed for the current user (idempotent). This is a write, so it must
// never run on the render/navigation critical path — call it from a server action triggered
// client-side after the content has already painted (see topic-visit-tracker.tsx).
// After a successful upsert the Redis progress + last-topic keys are invalidated so the
// next read reflects the new state without waiting for the TTL to expire.
export async function markTopicComplete(topicId: number, user?: User | null): Promise<void> {
  const supabase = await createClient()
  const resolvedUser = user ?? (await supabase.auth.getUser()).data.user
  if (!resolvedUser) return

  await supabase
    .from("soq_progress")
    .upsert({ user_id: resolvedUser.id, topic_id: topicId }, { onConflict: "user_id,topic_id", ignoreDuplicates: true })

  // Bust the Redis cache so the sidebar & dashboard see fresh completion state
  await invalidateUserProgress(resolvedUser.id)

  // Invalidate leaderboard cache
  revalidateTag("soq-leaderboard")
}

// Returns the most recently visited topic for the user.
// Redis TTL: 5 min. Invalidated by markTopicComplete.
export const getLastVisitedTopic = cache(async (user?: User | null): Promise<{
  phaseSlug: string
  topicSlug: string
  topicTitle: string
} | null> => {
  const resolvedUser = user ?? (await getCurrentUser())
  if (!resolvedUser) return null

  return withCache(
    cacheKey.lastVisitedTopic(resolvedUser.id),
    TTL.lastVisitedTopic,
    async () => {
      const supabase = await createClient()
      const { data } = await supabase
        .from("soq_progress")
        .select("topic_id, soq_topics(slug, title, soq_phases(slug))")
        .eq("user_id", resolvedUser.id)
        .order("topic_id", { ascending: false })
        .limit(1)
        .single()

      if (!data) return null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const topic = data.soq_topics as any
      if (!topic) return null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const phase = topic.soq_phases as any
      if (!phase) return null

      return { phaseSlug: phase.slug, topicSlug: topic.slug, topicTitle: topic.title }
    },
  )
})

// ---------------------------------------------------------------------------
// User profiles
// ---------------------------------------------------------------------------

export type UserProfile = {
  id: string
  fullName: string | null
  university: string | null
  email: string | null
  phone: string | null
  gender: "male" | "female" | "non_binary" | "prefer_not_to_say" | null
}

/** Returns the profile for the currently-authenticated user. */
export const getUserProfile = cache(async (): Promise<UserProfile | null> => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, full_name, university, email, phone, gender")
    .eq("id", user.id)
    .single()

  if (error || !data) {
    return {
      id: user.id,
      fullName: null,
      university: null,
      email: user.email ?? null,
      phone: null,
      gender: null,
    }
  }
  return {
    id: data.id,
    fullName: data.full_name ?? null,
    university: data.university ?? null,
    email: data.email ?? user.email ?? null,
    phone: data.phone ?? null,
    gender: data.gender ?? null,
  }
})

/** Upserts the current user's profile. Server action–safe. */
export async function upsertUserProfile(
  profile: Omit<UserProfile, "id">,
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // Check existing profile
  const { data: existing } = await supabase
    .from("user_profiles")
    .select("full_name, university, email, phone, gender")
    .eq("id", user.id)
    .single()

  if (existing) {
    const checks = [
      { initial: existing.full_name, current: profile.fullName },
      { initial: existing.university, current: profile.university },
      { initial: existing.email, current: profile.email },
      { initial: existing.phone, current: profile.phone },
      { initial: existing.gender, current: profile.gender },
    ]

    for (const check of checks) {
      const wasFilled = check.initial !== null && check.initial !== undefined && String(check.initial).trim() !== ""
      const isEmptyNow = check.current === null || check.current === undefined || String(check.current).trim() === ""
      if (wasFilled && isEmptyNow) {
        return { error: "Field cannot be set empty" }
      }
    }
  }

  const { error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        id: user.id,
        full_name: profile.fullName,
        university: profile.university,
        email: profile.email ?? user.email,
        phone: profile.phone,
        gender: profile.gender,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )

  if (error) return { error: error.message }
  return { error: null }
}

// Leaderboard
// Uses the service-role client so it can bypass RLS.
// Reads the denormalised completed_topics_count + last_completed_at columns
// that live directly on user_profiles (kept in sync by the DB trigger in
// supabase_progress_counter.sql). Single query, DB-level sort, no join needed.
// Only users with ALL 5 profile fields filled AND at least 1 completed topic appear.
// ---------------------------------------------------------------------------

export type LeaderboardEntry = {
  id: string
  fullName: string
  university: string
  completedCount: number
  lastProgressAt: string
}

export type LeaderboardResult = {
  entries: LeaderboardEntry[]
}

export const getLeaderboard = unstable_cache(
  async (): Promise<LeaderboardResult> => {
    const supabase = getServiceClient()

    // Single query — sorted at DB level
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, full_name, university, email, phone, gender, completed_topics_count, last_completed_at")
      .gt("completed_topics_count", 0)                          // must have at least 1 topic
      .order("completed_topics_count", { ascending: false })
      .order("last_completed_at",      { ascending: false, nullsFirst: false })

    if (error) {
      console.error("[leaderboard] query failed:", error)
      return { entries: [] }
    }

    // Client-side guard: all 5 profile fields must be non-empty
    const entries: LeaderboardEntry[] = (data ?? [])
      .filter((p) =>
        p.full_name?.trim() &&
        p.university?.trim() &&
        p.email?.trim() &&
        p.phone?.trim() &&
        p.gender,
      )
      .map((p) => ({
        id: p.id,
        fullName:       p.full_name,
        university:     p.university,
        completedCount: p.completed_topics_count,
        lastProgressAt: p.last_completed_at ?? "",
      }))

    return { entries }
  },
  ["soq-leaderboard"],
  { revalidate: 300, tags: ["soq-leaderboard"] },
)
