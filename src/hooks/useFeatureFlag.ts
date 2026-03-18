"use client"

import type { FeatureFlagKey } from "@/lib/featureFlags"

export function useFeatureFlag(flag: FeatureFlagKey): boolean {
  try {
    const flags = JSON.parse(process.env.NEXT_PUBLIC_FEATURE_FLAGS ?? "{}") as Record<FeatureFlagKey, boolean>
    return flags[flag] ?? false
  } catch {
    return false
  }
}
