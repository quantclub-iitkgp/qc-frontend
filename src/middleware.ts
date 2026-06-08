import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import type { User } from "@supabase/supabase-js"
import type { FeatureFlagKey } from "@/lib/featureFlags"

// ---------------------------------------------------------------------------
// Middleware-local Redis client — instantiated once per cold-start.
// We can't import from @/lib/redis here because middleware runs on the Edge
// runtime which has a restricted module graph; a direct instantiation is fine.
// ---------------------------------------------------------------------------
let _redis: Redis | null | undefined
function getRedis(): Redis | null {
  if (_redis !== undefined) return _redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  _redis = url && token ? new Redis({ url, token }) : null
  return _redis
}

/** Extract the Supabase session cookie value to use as the Redis cache key. */
function getSessionToken(request: NextRequest): string | null {
  // Supabase SSR stores the token in a cookie named sb-<project-ref>-auth-token
  const entry = request.cookies
    .getAll()
    .find(({ name }) => name.startsWith("sb-") && name.endsWith("-auth-token"))
  return entry?.value ?? null
}

const USER_CACHE_TTL = 60 // seconds

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

  // ------------------------------------------------------------------
  // Fast path: Redis cache hit — skip the Supabase auth round-trip.
  // ------------------------------------------------------------------
  const sessionToken = getSessionToken(request)
  if (sessionToken) {
    const r = getRedis()
    if (r) {
      try {
        const cached = await r.get<User>(`soq:user:${sessionToken}`)
        if (cached) {
          // User is authenticated and cached — proceed immediately
          return NextResponse.next({ request })
        }
      } catch {
        // Redis unavailable — fall through to live auth check
      }
    }
  }

  // ------------------------------------------------------------------
  // Slow path: verify session with Supabase, then populate the cache.
  // ------------------------------------------------------------------
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

  // Cache the verified user so subsequent requests on this session are fast
  if (sessionToken) {
    const r = getRedis()
    if (r) {
      try {
        await r.set(`soq:user:${sessionToken}`, user, { ex: USER_CACHE_TTL })
      } catch {
        // Best-effort — never block the response
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/soq", "/soq/:path+"],
}

