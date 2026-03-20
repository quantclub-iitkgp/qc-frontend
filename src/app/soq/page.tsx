import { notFound } from "next/navigation"
import { isFeatureEnabled } from "@/lib/featureFlags"
import { SoQWaitlistPage } from "./_components/soq-waitlist-page"
import { SoQProgramLanding } from "./_components/soq-program-landing"
import { getAllPhasesWithTopics, getCurrentUser, getUserProgress, getLastVisitedTopic } from "@/lib/soq-api"

export const metadata = {
  title: "Summer of Quant | Quant Club IIT KGP",
  description:
    "A 12-week intensive program covering quantitative finance, systematic trading, and machine learning for markets — by Quant Club IIT Kharagpur.",
}

export default async function SoQPage() {
  const waitlistEnabled = isFeatureEnabled("soq-waitlist")
  const programEnabled = isFeatureEnabled("soq-program")

  if (!waitlistEnabled && !programEnabled) notFound()

  if (programEnabled) {
    const [phasesWithTopics, user] = await Promise.all([getAllPhasesWithTopics(), getCurrentUser()])
    const [completedTopicIds, lastVisited] = user
      ? await Promise.all([getUserProgress(), getLastVisitedTopic()])
      : [[], null]
    return (
      <SoQProgramLanding
        phasesWithTopics={phasesWithTopics}
        userEmail={user?.email ?? null}
        completedTopicIds={completedTopicIds}
        lastVisited={lastVisited}
      />
    )
  }

  return <SoQWaitlistPage />
}
