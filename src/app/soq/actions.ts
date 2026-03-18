"use server"

import { getSupabaseClient } from "@/lib/supabase"

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
