import { isFeatureEnabled, type FeatureFlagKey } from "@/lib/featureFlags"

interface FeatureFlagProps {
  flag: FeatureFlagKey
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureFlag({ flag, children, fallback = null }: FeatureFlagProps) {
  if (!isFeatureEnabled(flag)) return <>{fallback}</>
  return <>{children}</>
}
