// Supabase Edge Function: share
// Deploy path: supabase/functions/share/index.ts
//
// PURPOSE: Returns a minimal HTML page with Open Graph meta tags so LinkedIn's
// crawler can read them. Real users landing on this URL are immediately
// redirected back to the main app.
//
// Deploy with:
//   supabase functions deploy share --no-verify-jwt
//
// This function does NOT require a JWT because LinkedIn's crawler is anonymous.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const APP_URL = Deno.env.get("APP_URL") ?? "https://quantclub-iitkgp.vercel.app/soq"

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const shareId = url.searchParams.get("share_id")

  if (!shareId) {
    return Response.redirect(APP_URL, 302)
  }

  // Use service-role key so we can query without RLS
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  )

  const { data, error } = await supabase
    .from("linkedin_shares")
    .select("share_id, temp_image_url, pre_fed_text")
    .eq("share_id", shareId)
    .single()

  if (error || !data) {
    // Share expired or not found — redirect to app
    return Response.redirect(APP_URL, 302)
  }

  const title = "Check out my Summer of Quant progress!"
  const description = data.pre_fed_text ?? title
  const imageUrl = data.temp_image_url
  const shareUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/share?share_id=${shareId}`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>

  <!-- Open Graph (LinkedIn reads these) -->
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="${shareUrl}" />
  <meta property="og:title"       content="${title}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image"       content="${imageUrl}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name"   content="Summer of Quant · Quant Club IIT KGP" />

  <!-- Twitter Card fallback -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image"       content="${imageUrl}" />
</head>
<body>
  <p>Redirecting to Summer of Quant…</p>
  <script>
    // Redirect real users immediately; crawlers don't run JS.
    window.location.replace(${JSON.stringify(APP_URL)});
  </script>
</body>
</html>`

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Allow LinkedIn's crawler to cache the page for up to 1 hour
      "Cache-Control": "public, max-age=3600",
    },
  })
})

// ── helpers ──────────────────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}
