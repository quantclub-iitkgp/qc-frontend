import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  // Redirect against the incoming request's origin so this works in dev and on
  // any deployment host without depending on a NEXT_PUBLIC_SITE_URL env var.
  return NextResponse.redirect(new URL("/soq", request.url))
}
