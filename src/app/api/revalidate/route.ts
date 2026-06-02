import { revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"
import { SOQ_STRUCTURE_TAG } from "@/lib/soq-api"

// Tags that may be invalidated on demand. Keeping an allowlist prevents arbitrary cache busting.
const ALLOWED_TAGS = new Set<string>([SOQ_STRUCTURE_TAG])

/**
 * On-demand cache invalidation for the cached SoQ course structure. Wire this into the admin
 * panel (or a Supabase database webhook) so edits to phases/topics appear instantly, while
 * normal visitor navigations keep serving cached data.
 *
 *   POST /api/revalidate?tag=soq-structure
 *   header:  x-revalidate-secret: <REVALIDATE_SECRET>
 *
 * Set REVALIDATE_SECRET in the environment to enable the endpoint.
 */
export async function POST(request: NextRequest) {
  const secret =
    request.headers.get("x-revalidate-secret") ??
    request.nextUrl.searchParams.get("secret")

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get("tag")
  if (!tag || !ALLOWED_TAGS.has(tag)) {
    return NextResponse.json(
      { error: "Missing or unknown tag", allowed: Array.from(ALLOWED_TAGS) },
      { status: 400 },
    )
  }

  revalidateTag(tag)
  return NextResponse.json({ revalidated: true, tag, now: Date.now() })
}
