import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/soq/login", "/soq/signup", "/api/"],
    },
    sitemap: "https://quantclub.ai/sitemap.xml",
  }
}
