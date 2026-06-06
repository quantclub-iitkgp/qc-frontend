"use server"

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
