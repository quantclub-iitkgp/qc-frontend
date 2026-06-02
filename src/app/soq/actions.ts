"use server"

import { getSupabaseClient } from "@/lib/supabase"
import { markTopicComplete } from "@/lib/soq-api"

// Persists topic completion for the current user. Invoked fire-and-forget from the client
// after the topic has already rendered, so the DB write never blocks navigation.
export async function markTopicCompleteAction(topicId: number): Promise<void> {
  try {
    await markTopicComplete(topicId)
  } catch {
    // Progress is best-effort; a failed write must not surface as a navigation error.
  }
}

export async function submitWaitlistAction(data: {
  name: string
  email: string
  phone: string
}): Promise<{ success: true } | { error: string }> {
  const { error } = await getSupabaseClient()
    .from("soq_waitlist")
    .insert({ name: data.name.trim(), email: data.email.trim().toLowerCase(), phone: data.phone.trim() })

  if (error) return { error: error.message }
  return { success: true }
}
