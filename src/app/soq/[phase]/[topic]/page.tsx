import { notFound } from "next/navigation"
import Link from "next/link"
import { Lock, ChevronRight } from "lucide-react"
import { getTopicContent, checkEnrollment, getPhaseWithTopics } from "@/lib/soq-api"
import { ContentRenderer } from "../../_components/content-renderer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Props {
  params: Promise<{ phase: string; topic: string }>
}

export default async function TopicPage({ params }: Props) {
  const { phase: phaseSlug, topic: topicSlug } = await params
  const [result, phaseResult, enrolled] = await Promise.all([
    getTopicContent(phaseSlug, topicSlug),
    getPhaseWithTopics(phaseSlug),
    checkEnrollment(),
  ])
  if (!result) notFound()

  const { topic, content } = result

  return (
    <div className="px-6 md:px-10 py-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      {phaseResult && (
        <nav className="flex items-center gap-1 text-xs text-foreground/50 mb-6 font-base">
          <Link href="/soq" className="hover:text-foreground transition-colors">SoQ</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/70">{phaseResult.phase.title}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{topic.title}</span>
        </nav>
      )}

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
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-2">
              {topic.title}
            </h1>
            {topic.description && (
              <p className="text-base text-foreground/60 leading-relaxed">{topic.description}</p>
            )}
          </div>

          {/* Content */}
          {content ? (
            <ContentRenderer body={content.body} />
          ) : (
            <div className="py-16 text-center border-2 border-dashed border-border rounded-base text-foreground/40 font-base">
              Content for this topic is being prepared. Check back soon.
            </div>
          )}
        </>
      )}
    </div>
  )
}
