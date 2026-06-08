// Canonical public origin of the site. Used by the sitemap, robots.txt, and Open Graph /
// canonical metadata — all generated at build time, so they can't use the request origin and
// must be a fixed value. Override per environment with NEXT_PUBLIC_SITE_URL (e.g. for preview
// deployments); the fallback is the production domain so prod is correct even with no env var.
// No trailing slash — callers append paths like `${SITE_URL}/sitemap.xml`.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.quantclubiitkgp.com"
