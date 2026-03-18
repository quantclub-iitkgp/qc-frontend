import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getTopicContent, checkEnrollment } from "@/lib/soq-api"
import { ContentRenderer } from "../../_components/content-renderer"
import { EnrollmentGate } from "../../_components/enrollment-gate"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  params: Promise<{ phase: string; topic: string }>
}

export default async function TopicPage({ params }: Props) {
  const { phase: phaseSlug, topic: topicSlug } = await params
  const result = await getTopicContent(phaseSlug, topicSlug)
  if (!result) notFound()

  const { topic, content } = result
  const enrolled = await checkEnrollment()

  if (!enrolled) return <EnrollmentGate />

  return (
    <div className="pt-[70px] pb-16 bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-dvh">
      <div className="container max-w-3xl mx-auto px-5 py-12">

        <Link href={`/soq/${phaseSlug}`} className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to phase
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-3">
            {topic.title}
          </h1>
          {topic.description && (
            <p className="text-lg text-foreground/60 leading-relaxed">{topic.description}</p>
          )}
        </div>

        <Card className="border-4 border-border shadow-shadow">
          <CardContent className="pt-8 pb-8 px-6 md:px-8">
            {content ? (
              <ContentRenderer body={content.body} />
            ) : (
              <div className="py-12 text-center text-foreground/40 font-base">
                Content for this topic is being prepared. Check back soon.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
