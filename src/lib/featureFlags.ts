export type FeatureFlagKey = "soq-program"

function loadFlags(): Record<FeatureFlagKey, boolean> {
  try {
    return JSON.parse(process.env.NEXT_PUBLIC_FEATURE_FLAGS ?? "{}") as Record<FeatureFlagKey, boolean>
  } catch {
    return { "soq-program": false }
  }
}

export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return loadFlags()[flag] ?? false
}

export function getFeatureFlags(): Record<FeatureFlagKey, boolean> {
  return loadFlags()
}
