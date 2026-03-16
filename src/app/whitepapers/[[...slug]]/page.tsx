import type { Metadata } from "next"
import { ArrowUpRight, FileText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getWhitepapers } from "@/lib/api"
import { WhitepaperCard } from "@/components/app/whitepaper-card"
import { Footer } from "@/components/app/footer"
import { AnimatedBlogHeader, AnimatedBlogBadge } from "@/components/app/blog-header-animations"
import { FadeIn } from "@/components/app/fade-in"
import PDFViewerWrapper from "@/components/app/pdf-viewer-wrapper"

interface WhitepaperPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const wps = await getWhitepapers()
  return [{ slug: [] }, ...wps.map((wp) => ({ slug: [wp.slug] }))]
}

export async function generateMetadata(props: WhitepaperPageProps): Promise<Metadata> {
  const { slug: slugParts = [] } = await props.params

  if (slugParts.length === 0) {
    return {
      title: "Whitepapers",
      description:
        "Research papers on quantitative finance, algorithmic trading, and portfolio construction from Quant Club IIT Kharagpur.",
    }
  }

  const wps = await getWhitepapers()
  const wp = wps.find((w) => w.slug === slugParts.join("/"))
  if (!wp) return { title: "Not Found" }

  return {
    title: wp.title,
    description: wp.description,
  }
}

export default async function WhitepaperPage(props: WhitepaperPageProps) {
  const { slug: slugParts = [] } = await props.params

  // ── Listing page ──────────────────────────────────────────────────────────
  if (slugParts.length === 0) {
    const wps = await getWhitepapers()
    const sorted = [...wps].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    const [featuredPaper, ...restPapers] = sorted

    return (
      <div className="min-h-dvh bg-background pt-[70px]">
        {/* Page header */}
        <header className="border-b-4 border-border bg-secondary-background bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:40px_40px]">
          <div className="mx-auto max-w-container px-5 py-16 md:py-20">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <AnimatedBlogBadge>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-2 border-4 border-border bg-main px-3 py-1.5 text-sm font-heading font-bold text-main-foreground shadow-shadow">
                      <FileText className="size-4" />
                      Quant Research
                    </span>
                  </div>
                </AnimatedBlogBadge>
                <AnimatedBlogHeader>
                  <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                    Research Papers &amp;
                    <br className="hidden sm:block" /> Whitepapers
                  </h1>
                  <p className="mt-4 text-lg text-foreground/70 max-w-xl">
                    Academic research on quantitative finance, algorithmic trading, and
                    portfolio construction by the researchers at Quant Club IIT Kharagpur.
                  </p>
                </AnimatedBlogHeader>
              </div>
              <Link
                href="/blogs"
                className="flex items-center gap-2 border-4 border-border bg-main px-5 py-3 font-heading font-bold text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all self-end"
              >
                View Blog
                <ArrowUpRight className="size-5" />
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-container px-5 py-12 md:py-16">
          {/* Featured paper */}
          {featuredPaper && (
            <section className="mb-12">
              <FadeIn>
                <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-foreground/50 mb-5 border-l-4 border-main pl-3">
                  Latest Paper
                </h2>
              </FadeIn>
              <WhitepaperCard whitepaper={featuredPaper} featured />
            </section>
          )}

          {/* Divider */}
          <div className="border-t-4 border-border mb-12" />

          {/* Grid of remaining papers */}
          {restPapers.length > 0 && (
            <section>
              <FadeIn>
                <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-foreground/50 mb-5 border-l-4 border-main pl-3">
                  More Papers
                </h2>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {restPapers.map((wp) => (
                  <WhitepaperCard key={wp.id} whitepaper={wp} />
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    )
  }

  // ── Detail page ───────────────────────────────────────────────────────────
  const allWps = await getWhitepapers()
  const wp = allWps.find((w) => w.slug === slugParts.join("/"))
  if (!wp) notFound()

  if (wp.pdfUrl) {
    return (
      <div className="min-h-dvh bg-background pt-[70px]">
        <PDFViewerWrapper url={wp.pdfUrl} />
      </div>
    )
  }

  // No PDF yet — show placeholder
  return (
    <div className="min-h-dvh bg-background pt-[70px] flex flex-col items-center justify-center px-5">
      <div className="border-4 border-border bg-secondary-background shadow-shadow p-12 max-w-lg w-full text-center">
        <FileText className="size-12 mx-auto mb-6 text-foreground/40" />
        <h1 className="text-2xl font-heading font-bold mb-3">{wp.title}</h1>
        {wp.description && (
          <p className="text-base text-foreground/60 mb-6">{wp.description}</p>
        )}
        <p className="text-sm font-heading font-bold uppercase tracking-widest text-foreground/40">
          PDF coming soon
        </p>
      </div>
    </div>
  )
}
