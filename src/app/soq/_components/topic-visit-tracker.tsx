"use client"

import { useEffect } from "react"
import { useSoQProgress } from "./soq-progress-provider"

export function TopicVisitTracker({ topicId }: { topicId: number }) {
  const { markVisited } = useSoQProgress()
  useEffect(() => {
    markVisited(topicId)
  }, [topicId, markVisited])
  return null
}
