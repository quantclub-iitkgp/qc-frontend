import type { MetadataRoute } from "next"
import { getBlogs, getWhitepapers } from "@/lib/api"

const BASE_URL = "https://quantclub.ai"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, whitepapers] = await Promise.all([
    getBlogs().catch(() => []),
    getWhitepapers().catch(() => []),
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
