import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { getPhaseWithTopics } from "@/lib/soq-api"

interface Props {
  params: Promise<{ phase: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { phase: phaseSlug } = await params
  const result = await getPhaseWithTopics(phaseSlug)
  if (!result) return {}
  return {
    title: `${result.phase.title} | Summer of Quant`,
    description: result.phase.description ?? "Summer of Quant program by Quant Club IIT Kharagpur.",
  }
}

export default async function PhasePage({ params }: Props) {
  const { phase: phaseSlug } = await params
  const result = await getPhaseWithTopics(phaseSlug)
  if (!result) notFound()

  const { phase, topics } = result

  if (topics.length > 0) {
    redirect(`/soq/${phaseSlug}/${topics[0].slug}`)
  }

  return (
    <div className="px-6 md:px-10 py-10 max-w-2xl">
      <h1 className="text-3xl font-heading font-bold mb-3">{phase.title}</h1>
      <p className="text-foreground/60">Topics for this phase are coming soon.</p>
    </div>
  )
}
