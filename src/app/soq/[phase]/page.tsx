import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Lock, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPhaseWithTopics, checkEnrollment } from "@/lib/soq-api"

interface Props {
  params: Promise<{ phase: string }>
}

export default async function PhasePage({ params }: Props) {
  const { phase: phaseSlug } = await params
  const result = await getPhaseWithTopics(phaseSlug)
  if (!result) notFound()

  const { phase, topics } = result
  const enrolled = await checkEnrollment()

  return (
    <div className="pt-[70px] pb-16 bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-dvh">
      <div className="container max-w-4xl mx-auto px-5 py-12">

        <Link href="/soq" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to all phases
        </Link>

        {/* Phase header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-main text-main-foreground border-2 border-border shadow-shadow text-xs font-heading rounded-base">
            <BookOpen className="h-3 w-3" />
            {topics.length} {topics.length === 1 ? "topic" : "topics"}
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-3">{phase.title}</h1>
          {phase.description && (
            <p className="text-lg text-foreground/60 max-w-2xl leading-relaxed">{phase.description}</p>
          )}
        </div>

        {/* Enrollment notice */}
        {!enrolled && (
          <Card className="border-4 border-border shadow-shadow mb-8 bg-main/5">
            <CardContent className="flex items-center gap-4 py-4">
              <Lock className="h-5 w-5 text-main shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm">Enrollment required to view content</p>
                <p className="text-xs text-foreground/60 mt-0.5">You can browse topics freely, but content requires enrollment.</p>
              </div>
              <Link href="/soq/login" className="shrink-0">
                <Button size="sm" variant="neutral">Sign in</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Topics list */}
        <div className="space-y-4">
          {topics.map((topic, i) => (
            <Link
              key={topic.id}
              href={`/soq/${phase.slug}/${topic.slug}`}
              className="block"
            >
              <Card className="border-4 border-border shadow-shadow cursor-pointer group transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow">
                      <span className="text-xs font-heading text-main-foreground">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="font-heading text-base group-hover:text-main transition-colors">
                        {topic.title}
                      </CardTitle>
                      {topic.description && (
                        <CardDescription className="text-sm text-foreground/60 mt-1 leading-relaxed">
                          {topic.description}
                        </CardDescription>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-main mt-0.5" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {topics.length === 0 && (
          <Card className="border-4 border-border shadow-shadow">
            <CardContent className="py-12 text-center text-foreground/40 font-base">
              Topics for this phase are coming soon.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
