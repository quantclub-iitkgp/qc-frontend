import { notFound } from "next/navigation"
import { isFeatureEnabled } from "@/lib/featureFlags"
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
  if (!isFeatureEnabled("soq-program")) notFound()

  // Every visitor here is signed in — middleware redirects logged-out users to /soq/login.
  // There is no enrollment gate: sign-up grants access to the whole program.
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
