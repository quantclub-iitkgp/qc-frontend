import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import type { FeatureFlagKey } from "@/lib/featureFlags"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip the public auth pages — everything else under /soq (incl. the root landing) requires login
  if (
    pathname.startsWith("/soq/login") ||
    pathname.startsWith("/soq/signup") ||
    pathname.startsWith("/soq/forgot-password")
  ) {
    return NextResponse.next()
  }

  // Only intercept the SoQ area
  if (pathname !== "/soq" && !pathname.startsWith("/soq/")) {
    return NextResponse.next()
  }

  // If soq-program flag is off, let the layout handle the notFound
  try {
    const flags = JSON.parse(
      process.env.NEXT_PUBLIC_FEATURE_FLAGS ?? "{}",
    ) as Record<FeatureFlagKey, boolean>
    if (!flags["soq-program"]) return NextResponse.next()
  } catch {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL(
      `/soq/login?next=${encodeURIComponent(pathname)}`,
      request.url,
    )
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/soq", "/soq/:path+"],
}
