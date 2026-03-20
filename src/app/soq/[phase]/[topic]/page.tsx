import { notFound } from "next/navigation"
import Link from "next/link"
import { Lock } from "lucide-react"
import { getTopicContent, checkEnrollment } from "@/lib/soq-api"
import { ContentRenderer } from "../../_components/content-renderer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Props {
  params: Promise<{ phase: string; topic: string }>
}

export default async function TopicPage({ params }: Props) {
  const { phase: phaseSlug, topic: topicSlug } = await params
  const result = await getTopicContent(phaseSlug, topicSlug)
  if (!result) notFound()

  const { topic, content } = result
  const enrolled = await checkEnrollment()

  return (
    <div className="px-6 md:px-10 py-10 max-w-3xl mx-auto">
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
        </>
      )}
    </div>
  )
}
