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
  }
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
