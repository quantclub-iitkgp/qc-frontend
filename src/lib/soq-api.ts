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

export async function getAllPhasesWithTopics(): Promise<SoQPhaseWithTopics[]> {
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
}

// Uses anon client — phases/topics are publicly readable (RLS: is_published = true)
export async function getPublishedPhases(): Promise<SoQPhase[]> {
  const { data, error } = await getSupabaseClient()
    .from("soq_phases")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(phaseFromRow)
}

export async function getPhaseWithTopics(
  phaseSlug: string,
): Promise<{ phase: SoQPhase; topics: SoQTopic[] } | null> {
  const { data: phaseData, error: phaseError } = await getSupabaseClient()
    .from("soq_phases")
    .select("*")
    .eq("slug", phaseSlug)
    .eq("is_published", true)
    .single()
  if (phaseError || !phaseData) return null

  const phase = phaseFromRow(phaseData)

  const { data: topicsData, error: topicsError } = await getSupabaseClient()
    .from("soq_topics")
    .select("*")
    .eq("phase_id", phase.id)
    .eq("is_published", true)
    .order("order_index", { ascending: true })
  if (topicsError) return null

  return { phase, topics: (topicsData ?? []).map(topicFromRow) }
}

// Uses SSR server client — content requires authenticated + enrolled user (RLS enforced in DB)
export async function getTopicContent(
  phaseSlug: string,
  topicSlug: string,
): Promise<{ topic: SoQTopic; content: SoQContent | null } | null> {
  // Get topic via anon (published check)
  const phaseResult = await getPhaseWithTopics(phaseSlug)
  if (!phaseResult) return null

  const topic = phaseResult.topics.find((t) => t.slug === topicSlug)
  if (!topic) return null

  // Get content via authenticated server client (RLS: enrolled users only)
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
}

// Check if the current authenticated user is enrolled
export async function checkEnrollment(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from("soq_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .single()

  return !!data
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Returns topic IDs the current user has completed
export async function getUserProgress(): Promise<number[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("soq_progress")
    .select("topic_id")
    .eq("user_id", user.id)

  return (data ?? []).map((r: { topic_id: number }) => r.topic_id)
}

// Marks a topic as completed for the current user (idempotent)
export async function markTopicComplete(topicId: number): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("soq_progress")
    .upsert({ user_id: user.id, topic_id: topicId }, { onConflict: "user_id,topic_id", ignoreDuplicates: true })
}

// Returns the most recently visited topic for the current user
export async function getLastVisitedTopic(): Promise<{
  phaseSlug: string
  topicSlug: string
  topicTitle: string
} | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("soq_progress")
    .select("topic_id, soq_topics(slug, title, soq_phases(slug))")
    .eq("user_id", user.id)
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
}
