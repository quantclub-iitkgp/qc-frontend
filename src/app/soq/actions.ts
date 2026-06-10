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

// Handles server-side upload and DB insertion to solve client-side cookie auth/RLS issues.
export async function shareOnLinkedInAction(
  formData: FormData,
  postText: string
): Promise<{ shareUrl: string } | { error: string }> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { error: "No image file provided" }
    }

    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()

    // Get active user from cookie session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: "Not authenticated" }
    }

    const shareId = crypto.randomUUID()
    const filePath = `shares/${shareId}.png`

    // Upload to bucket
    const { error: uploadError } = await supabase.storage
      .from("temp-shares")
      .upload(filePath, file, {
        contentType: "image/png",
        upsert: false,
      })

    if (uploadError) {
      return { error: `Upload failed: ${uploadError.message}` }
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("temp-shares")
      .getPublicUrl(filePath)

    const tempImageUrl = publicUrlData.publicUrl

    // Insert DB record
    const { error: dbError } = await supabase
      .from("linkedin_shares")
      .insert({
        share_id: shareId,
        temp_image_url: tempImageUrl,
        pre_fed_text: postText,
        user_id: user.id,
      })

    if (dbError) {
      return { error: `Database insert failed: ${dbError.message}` }
    }

    // NEXT_PUBLIC_SITE_URL overrides host detection — set it in .env.local to your ngrok URL for local testing.
    // In production the request host is used automatically.
    const { headers } = await import("next/headers")
    const headersList = await headers()
    let host = headersList.get("host") || "www.quantclubiitkgp.com"
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      host = "www.quantclubiitkgp.com"
    }
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? `https://${host}`
    const shareUrl = `${siteBase}/soq/share?share_id=${shareId}`

    return { shareUrl }
  } catch (err) {
    console.error("[shareOnLinkedInAction] error:", err)
    return { error: err instanceof Error ? err.message : "Server error" }
  }
}
