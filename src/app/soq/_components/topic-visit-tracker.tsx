"use client"

import { useEffect } from "react"
import { useSoQProgress } from "./soq-progress-provider"
import { markTopicCompleteAction } from "../actions"

export function TopicVisitTracker({ topicId }: { topicId: number }) {
  const { markVisited } = useSoQProgress()
  useEffect(() => {
    // Optimistic local checkmark (instant), then persist server-side without blocking.
    markVisited(topicId)
    void markTopicCompleteAction(topicId)
  }, [topicId, markVisited])
  return null
}
