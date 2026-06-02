import { cache } from "react"
import { unstable_cache } from "next/cache"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { getSupabaseClient } from "@/lib/supabase"

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

// Public, rarely-changing data fetched via the anon client (no cookies → safe to cache).
// Cached across requests (tag-invalidated on admin edit) AND deduped within a request, so
// the layout, the page, and generateMetadata all share a single Supabase round-trip.
export const getAllPhasesWithTopics = unstable_cache(
  async (): Promise<SoQPhaseWithTopics[]> => {
    const { data, error } = await getSupabaseClient()
      .from("soq_phases")
      .select("*, soq_topics(*)")
      .eq("is_published", true)
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
  ["soq-all-phases-with-topics"],
  { tags: [SOQ_STRUCTURE_TAG], revalidate: 3600 },
)

// Uses anon client — phases are publicly readable (RLS: is_published = true).
export const getPublishedPhases = unstable_cache(
  async (): Promise<SoQPhase[]> => {
    const { data, error } = await getSupabaseClient()
      .from("soq_phases")
      .select("*")
      .eq("is_published", true)
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

// Topic metadata comes from the cached structure (0 queries); only the gated content body
// hits Supabase via the authenticated SSR client (RLS: enrolled users only). Deduped per
// request so the page and generateMetadata don't fetch the body twice.
export const getTopicContent = cache(
  async (
    phaseSlug: string,
    topicSlug: string,
  ): Promise<{ topic: SoQTopic; content: SoQContent | null } | null> => {
    const all = await getAllPhasesWithTopics()
    const phase = all.find((p) => p.slug === phaseSlug)
    const topic = phase?.topics.find((t) => t.slug === topicSlug)
    if (!topic) return null

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("soq_content")
      .select("*")
      .eq("topic_id", topic.id)
      .single()

    if (error || !data) return { topic, content: null }

    return {
      topic,
      content: { id: data.id, topicId: data.topic_id, body: data.body },
    }
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

// Check if a given user (or the current authenticated user) is enrolled. Deduped per
// request when called with the same resolved user reference.
export const checkEnrollment = cache(async (user?: User | null): Promise<boolean> => {
  const resolvedUser = user ?? (await getCurrentUser())
  if (!resolvedUser) return false

  const supabase = await createClient()
  const { data } = await supabase
    .from("soq_enrollments")
    .select("id")
    .eq("user_id", resolvedUser.id)
    .single()

  return !!data
})

// Returns topic IDs the user has completed. Deduped per request.
export const getUserProgress = cache(async (user?: User | null): Promise<number[]> => {
  const resolvedUser = user ?? (await getCurrentUser())
  if (!resolvedUser) return []

  const supabase = await createClient()
  const { data } = await supabase
    .from("soq_progress")
    .select("topic_id")
    .eq("user_id", resolvedUser.id)

  return (data ?? []).map((r: { topic_id: number }) => r.topic_id)
})

// Marks a topic as completed for the current user (idempotent). This is a write, so it must
// never run on the render/navigation critical path — call it from a server action triggered
// client-side after the content has already painted (see topic-visit-tracker.tsx).
export async function markTopicComplete(topicId: number, user?: User | null): Promise<void> {
  const supabase = await createClient()
  const resolvedUser = user ?? (await supabase.auth.getUser()).data.user
  if (!resolvedUser) return

  await supabase
    .from("soq_progress")
    .upsert({ user_id: resolvedUser.id, topic_id: topicId }, { onConflict: "user_id,topic_id", ignoreDuplicates: true })
}

// Returns the most recently visited topic for the user
export const getLastVisitedTopic = cache(async (user?: User | null): Promise<{
  phaseSlug: string
  topicSlug: string
  topicTitle: string
} | null> => {
  const resolvedUser = user ?? (await getCurrentUser())
  if (!resolvedUser) return null

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
})
