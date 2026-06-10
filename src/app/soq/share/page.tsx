import { createClient } from "@supabase/supabase-js"
import { Metadata } from "next"

interface SharePageProps {
  searchParams: Promise<{ share_id?: string }>
}

// Generate dynamic metadata for crawlers (LinkedIn, Twitter, Slack, etc.)
export async function generateMetadata(
  { searchParams }: SharePageProps
): Promise<Metadata> {
  const { share_id } = await searchParams

  if (!share_id) return {}

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from("linkedin_shares")
    .select("share_id, temp_image_url, pre_fed_text")
    .eq("share_id", share_id)
    .single()

  if (!data) return {}

  const title = "Check out my Summer of Quant progress!"
  const description = data.pre_fed_text || title
  const imageUrl = data.temp_image_url

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Summer of Quant Progress Dashboard",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function SharePage({ searchParams }: SharePageProps) {
  // Real users landing here will be redirected back to the main SOQ page using JS redirect.
  // Crawlers don't run JS, so they will scrape the meta tags from generateMetadata above.
  return (
    <html lang="en">
      <head>
        <title>Redirecting...</title>
      </head>
      <body style={{ fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
        <p>Redirecting to Summer of Quant...</p>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace("/soq");`,
          }}
        />
      </body>
    </html>
  )
}
