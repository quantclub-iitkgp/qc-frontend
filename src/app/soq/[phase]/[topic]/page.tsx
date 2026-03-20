import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, ArrowLeft, ArrowRight, Clock, Lock } from "lucide-react"
import { getTopicContent, checkEnrollment, getAllPhasesWithTopics } from "@/lib/soq-api"
import type { SoQPhaseWithTopics } from "@/lib/soq-api"
import { ContentRenderer } from "../../_components/content-renderer"
import { TOC } from "../../_components/toc"
import { KeyboardNav } from "../../_components/keyboard-nav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Props {
  params: Promise<{ phase: string; topic: string }>
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

export default async function TopicPage({ params }: Props) {
  const { phase: phaseSlug, topic: topicSlug } = await params

  const [result, allPhases, enrolled] = await Promise.all([
    getTopicContent(phaseSlug, topicSlug),
    getAllPhasesWithTopics(),
    checkEnrollment(),
  ])

  // Auto-mark as complete when user views the topic
  if (enrolled && result) {
    const { markTopicComplete } = await import("@/lib/soq-api")
    await markTopicComplete(result.topic.id)
  }
  if (!result) notFound()

  const { topic, content } = result
  const currentPhase = allPhases.find((p) => p.slug === phaseSlug)
  const { prev, next, current, total } = getPrevNext(allPhases, phaseSlug, topicSlug)

  const prevHref = prev ? `/soq/${prev.phaseSlug}/${prev.topic.slug}` : null
  const nextHref = next ? `/soq/${next.phaseSlug}/${next.topic.slug}` : null

  return (
    <div className="px-6 md:px-10 py-8 max-w-5xl mx-auto">
      {/* Breadcrumb + progress */}
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-1 text-xs text-foreground/50 font-base min-w-0">
          <Link href="/soq" className="hover:text-foreground transition-colors shrink-0">
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

      {!enrolled ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="border-4 border-border shadow-shadow max-w-md w-full text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow">
                  <Lock className="h-7 w-7 text-main-foreground" />
                </div>
              </div>
              <CardTitle className="text-xl font-heading">Enrollment Required</CardTitle>
              <CardDescription className="text-foreground/60">
                This content is available to enrolled SoQ participants only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/soq/login">
                <Button variant="neutral" className="w-full">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
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

          {/* Content + TOC */}
          {content ? (
            <div className="flex gap-10 items-start">
              <div className="flex-1 min-w-0">
                <ContentRenderer body={content.body} />
              </div>
              <TOC body={content.body} />
            </div>
          ) : (
            <div className="py-16 text-center border-2 border-dashed border-border rounded-base text-foreground/40 font-base">
              Content for this topic is being prepared. Check back soon.
            </div>
          )}

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
                <Link href="/soq" className="text-sm font-medium text-main hover:underline">
                  Back to overview
                </Link>
              </div>
            )}
          </div>

          <KeyboardNav prevHref={prevHref} nextHref={nextHref} />
        </>
      )}
    </div>
  )
}
