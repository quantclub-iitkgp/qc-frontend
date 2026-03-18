import { notFound } from "next/navigation"
import { isFeatureEnabled } from "@/lib/featureFlags"
import { SoQWaitlistPage } from "./_components/soq-waitlist-page"
import { SoQProgramLanding } from "./_components/soq-program-landing"
import { getPublishedPhases, getCurrentUser } from "@/lib/soq-api"

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
    const [phases, user] = await Promise.all([getPublishedPhases(), getCurrentUser()])
    return <SoQProgramLanding phases={phases} userEmail={user?.email ?? null} />
  }

  return <SoQWaitlistPage />
}
