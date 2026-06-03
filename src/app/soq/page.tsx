import { notFound } from "next/navigation"
import { isFeatureEnabled } from "@/lib/featureFlags"
import { SoQWaitlistPage } from "./_components/soq-waitlist-page"
import { SoQProgramLanding } from "./_components/soq-program-landing"
import {
  getAllPhasesWithTopics,
  getCurrentUser,
  getUserProgress,
  getLastVisitedTopic,
} from "@/lib/soq-api"

export const metadata = {
  title: "Summer of Quant | Quant Club IIT KGP",
  description:
    "A 12-week intensive program covering quantitative finance, systematic trading, and machine learning for markets — by Quant Club IIT Kharagpur.",
}

export default async function SoQPage() {
  const waitlistEnabled = isFeatureEnabled("soq-waitlist")
  const programEnabled = isFeatureEnabled("soq-program")

  if (!waitlistEnabled && !programEnabled) notFound()

  // When the program is on, every signed-in user (middleware enforces login) sees it —
  // there is no enrollment gate.
  if (programEnabled) {
    const user = await getCurrentUser()

    // Run all subsequent reads in parallel — they share the cached user.
    const [phasesWithTopics, completedTopicIds, lastVisited] = await Promise.all([
      getAllPhasesWithTopics(),
      user ? getUserProgress(user) : Promise.resolve<number[]>([]),
      user ? getLastVisitedTopic(user) : Promise.resolve(null),
    ])

    return (
      <SoQProgramLanding
        phases={phasesWithTopics}
        userEmail={user?.email ?? null}
        completedTopicIds={completedTopicIds}
        lastVisited={lastVisited}
      />
    )
  }

  return <SoQWaitlistPage />
}
