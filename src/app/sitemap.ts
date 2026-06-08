import type { MetadataRoute } from "next"
import { getBlogs, getWhitepapers } from "@/lib/api"

const BASE_URL = "https://quantclub.ai"

// The sitemap is statically generated at build, so its DB reads run during the build. They
// must be best-effort: a slow or disk-IO-throttled Supabase must never block a deploy. A
// hanging query would otherwise time out the whole sitemap route at 60s and fail the build.
// We cap each fetch and fall back to an empty list — the sitemap still ships with every static
// route, and the next rebuild on a healthy DB fills in the blog/whitepaper URLs. .catch handles
// a fast rejection; the timeout handles a query that just hangs (which .catch alone won't).
const FETCH_TIMEOUT_MS = 10_000

function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), FETCH_TIMEOUT_MS)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, whitepapers] = await Promise.all([
    withTimeout(getBlogs(), []).catch(() => []),
    withTimeout(getWhitepapers(), []).catch(() => []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/whitepapers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/soq`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/aboutus`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contactus`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE_URL}/blogs/${blog.slugAsParams ?? blog.slug.replace("/blogs/", "")}`,
    lastModified: blog.date ? new Date(blog.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const whitepaperRoutes: MetadataRoute.Sitemap = whitepapers.map((wp) => ({
    url: `${BASE_URL}/whitepapers/${wp.slug}`,
    lastModified: wp.publishedAt ? new Date(wp.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes, ...whitepaperRoutes]
}
