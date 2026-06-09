import { notFound } from "next/navigation"
import { isFeatureEnabled } from "@/lib/featureFlags"
import { SoQProgramLanding } from "./_components/soq-program-landing"
import {
  getAllPhasesWithTopics,
  getCurrentUser,
  getUserProgress,
  getLastVisitedTopic,
  getUserProfile,
  getLeaderboard,
} from "@/lib/soq-api"

export const metadata = {
  title: "Summer of Quant | Quant Club IIT KGP",
  description:
    "A 12-week intensive program covering quantitative finance, systematic trading, and machine learning for markets — by Quant Club IIT Kharagpur.",
}

export default async function SoQPage() {
  if (!isFeatureEnabled("soq-program")) notFound()

  const user = await getCurrentUser()

  const [phasesWithTopics, completedTopicIds, lastVisited, userProfile, leaderboardResult] =
    await Promise.all([
      getAllPhasesWithTopics(),
      user ? getUserProgress(user) : Promise.resolve<number[]>([]),
      user ? getLastVisitedTopic(user) : Promise.resolve(null),
      user ? getUserProfile() : Promise.resolve(null),
      getLeaderboard(),
    ])

  return (
    <SoQProgramLanding
      phases={phasesWithTopics}
      userEmail={user?.email ?? null}
      userId={user?.id ?? null}
      completedTopicIds={completedTopicIds}
      lastVisited={lastVisited}
      userProfile={userProfile}
      leaderboard={leaderboardResult.entries}
    />
  )
}

