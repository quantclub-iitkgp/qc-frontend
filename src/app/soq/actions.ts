"use server"

import { markTopicComplete, upsertUserProfile, type UserProfile } from "@/lib/soq-api"
import { revalidatePath } from "next/cache"

// Persists topic completion for the current user. Invoked fire-and-forget from the client
// after the topic has already rendered, so the DB write never blocks navigation.
export async function markTopicCompleteAction(topicId: number): Promise<void> {
  try {
    await markTopicComplete(topicId)
  } catch {
    // Progress is best-effort; a failed write must not surface as a navigation error.
  }
}

// Saves / updates the current user's profile fields.
export async function upsertUserProfileAction(
  profile: Omit<UserProfile, "id">,
): Promise<{ error: string | null }> {
  const result = await upsertUserProfile(profile)
  if (!result.error) {
    const { revalidateTag } = await import("next/cache")
    revalidateTag("soq-leaderboard")
    revalidatePath("/soq")
  }
  return result
}


