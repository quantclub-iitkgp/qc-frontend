import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, ArrowLeft, ArrowRight, Clock } from "lucide-react"
import type { Metadata } from "next"
import GithubSlugger from "github-slugger"
import { getTopicContent, getAllPhasesWithTopics } from "@/lib/soq-api"
import type { SoQPhaseWithTopics } from "@/lib/soq-api"
import { ContentRenderer } from "../../_components/content-renderer"
import { TopicVisitTracker } from "../../_components/topic-visit-tracker"
import { TableOfContents } from "@/components/app/toc"
import { KeyboardNav } from "../../_components/keyboard-nav"

interface Props {
  params: Promise<{ phase: string; topic: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { phase: phaseSlug, topic: topicSlug } = await params
  const result = await getTopicContent(phaseSlug, topicSlug)
  if (!result) return {}
  const { topic } = result
  return {
    title: `${topic.title} | Summer of Quant`,
    description: topic.description ?? "Summer of Quant program content by Quant Club IIT Kharagpur.",
    openGraph: {
      title: topic.title,
      description: topic.description ?? undefined,
      type: "article",
      images: [{ url: "/quant_club_iit_kharagpur_logo.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: topic.title,
      description: topic.description ?? undefined,
    },
  }
}

function getPrevNext(phases: SoQPhaseWithTopics[], phaseSlug: string, topicSlug: string) {
  const flat = phases.flatMap((p) =>
    p.topics.map((t) => ({ phaseSlug: p.slug, topic: t })),
  )
  const idx = flat.findIndex(
    (item) => item.phaseSlug === phaseSlug && item.topic.slug === topicSlug,
  )
  if (idx === -1) return { prev: null, next: null, current: 0, total: flat.length }
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
    current: idx + 1,
    total: flat.length,
  }
}

function readingTime(body: string): number {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200))
}

function extractTOC(body: string) {
  const slugger = new GithubSlugger()
  const items: { depth: number; value: string; id: string }[] = []
  for (const line of body.split("\n")) {
    // No $ anchor and no non-null assertion: CRLF bodies leave a trailing \r that
    // `.` can't match, and empty headings ("## ") have no text — skip, don't crash.
    const match = line.match(/^(#{1,3})\s+(.+)/)
    if (!match) continue
    const value = match[2]
      .replace(/\r$/, "")
      .replace(/\*\*/g, "")
      .replace(/`([^`]*)`/g, "$1")
      .trim()
    items.push({ depth: match[1].length, value, id: slugger.slug(value) })
  }
  return items
}

export default async function TopicPage({ params }: Props) {
  const { phase: phaseSlug, topic: topicSlug } = await params

  const [result, allPhases] = await Promise.all([
    getTopicContent(phaseSlug, topicSlug),
    getAllPhasesWithTopics(),
  ])

  if (!result) notFound()

  // Progress is recorded off the critical path by <TopicVisitTracker> (a client effect that
  // fires a server action after paint) — never block the navigation on a DB write here.

  const { topic, content } = result
  const currentPhase = allPhases.find((p) => p.slug === phaseSlug)
  const { prev, next, current, total } = getPrevNext(allPhases, phaseSlug, topicSlug)
  const tocItems = content ? extractTOC(content.body) : []

  const prevHref = prev ? `/soq/${prev.phaseSlug}/${prev.topic.slug}` : null
  const nextHref = next ? `/soq/${next.phaseSlug}/${next.topic.slug}` : null

  return (
    <div className="px-6 md:px-10 py-8 max-w-5xl mx-auto">
      {/* Breadcrumb + progress */}
      <div className="flex items-center justify-between mb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-foreground/50 font-base min-w-0">
          <Link href="/soq/" className="hover:text-foreground transition-colors shrink-0">
            SoQ
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          {currentPhase && (
            <>
              <span className="text-foreground/70 truncate hidden sm:block">
                {currentPhase.title}
              </span>
              <ChevronRight className="h-3 w-3 shrink-0 hidden sm:block" />
            </>
          )}
          <span className="text-foreground truncate">{topic.title}</span>
        </nav>
        <span className="text-xs text-foreground/40 tabular-nums shrink-0 ml-4">
          {current} / {total}
        </span>
      </div>

      <div className={tocItems.length > 2 ? "xl:flex xl:gap-10 xl:items-start" : ""}>
          <div className="flex-1 min-w-0">
            {/* Topic header */}
            <div className="mb-8 pb-6 border-b-2 border-border">
              <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-3">
                {topic.title}
              </h1>
              <div className="flex items-start justify-between gap-4">
                {topic.description && (
                  <p className="text-base text-foreground/60 leading-relaxed">
                    {topic.description}
                  </p>
                )}
                {content && (
                  <div className="flex items-center gap-1.5 text-xs text-foreground/40 shrink-0 mt-0.5 border-2 border-border rounded-base px-2 py-1">
                    <Clock className="h-3 w-3" />
                    <span>{readingTime(content.body)} min read</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            {content ? (
              <ContentRenderer body={content.body} />
            ) : (
              <div className="py-16 text-center border-2 border-dashed border-border rounded-base text-foreground/40 font-base">
                Content for this topic is being prepared. Check back soon.
              </div>
            )}

            <TopicVisitTracker topicId={topic.id} />

            {/* Prev / Next navigation */}
            <div className="mt-12 pt-6 border-t-2 border-border grid grid-cols-2 gap-3">
              {prev ? (
                <Link href={prevHref!} className="group">
                  <div className="h-full p-3 rounded-base border-2 border-border shadow-shadow cursor-pointer transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
                    <p className="text-xs text-foreground/40 mb-1.5 flex items-center gap-1">
                      <ArrowLeft className="h-3 w-3" />
                      Previous
                    </p>
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-main transition-colors">
                      {prev.topic.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link href={nextHref!} className="group text-right">
                  <div className="h-full p-3 rounded-base border-2 border-border shadow-shadow cursor-pointer transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
                    <p className="text-xs text-foreground/40 mb-1.5 flex items-center gap-1 justify-end">
                      Next
                      <ArrowRight className="h-3 w-3" />
                    </p>
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-main transition-colors">
                      {next.topic.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="p-3 rounded-base border-2 border-dashed border-border text-right flex flex-col justify-center">
                  <p className="text-xs text-foreground/40 mb-1">You&apos;ve reached the end!</p>
                  <Link href="/soq/" className="text-sm font-medium text-main hover:underline">
                    Back to overview
                  </Link>
                </div>
              )}
            </div>

            <KeyboardNav prevHref={prevHref} nextHref={nextHref} />
          </div>

          {tocItems.length > 2 && (
            <aside className="hidden xl:block w-52 shrink-0 sticky top-6">
              <div className="border-4 border-border shadow-shadow rounded-base overflow-hidden bg-background">
                <TableOfContents items={tocItems} />
              </div>
            </aside>
          )}
      </div>
    </div>
  )
}
