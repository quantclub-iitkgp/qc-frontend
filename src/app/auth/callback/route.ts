import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/soq"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data?.user) {
      const hasEmailIdentity = data.user.identities?.some(
        (identity) => identity.provider === "email",
      )
      if (!hasEmailIdentity) {
        return NextResponse.redirect(
          `${origin}/soq/setup-password?next=${encodeURIComponent(next)}`,
        )
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/soq/login?error=auth_callback_failed`)
}
