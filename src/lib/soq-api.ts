import { cache } from "react"
import { unstable_cache } from "next/cache"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { getSupabaseClient } from "@/lib/supabase"
import { getServiceClient } from "@/lib/supabase/service"

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
