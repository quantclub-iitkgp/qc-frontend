import { notFound } from "next/navigation"
import { isFeatureEnabled } from "@/lib/featureFlags"

export default function PhaseLayout({ children }: { children: React.ReactNode }) {
  if (!isFeatureEnabled("soq-program")) notFound()
  return <>{children}</>
}
