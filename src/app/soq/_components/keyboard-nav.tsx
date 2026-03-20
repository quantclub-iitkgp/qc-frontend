"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface Props {
  prevHref: string | null
  nextHref: string | null
}

export function KeyboardNav({ prevHref, nextHref }: Props) {
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === "ArrowLeft" && prevHref) router.push(prevHref)
      if (e.key === "ArrowRight" && nextHref) router.push(nextHref)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [prevHref, nextHref, router])

  if (!prevHref && !nextHref) return null

  return (
    <div className="mt-6 flex items-center justify-center gap-6 text-xs text-foreground/30 select-none">
      {prevHref ? (
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary font-mono text-[10px]">←</kbd>
          prev
        </span>
      ) : (
        <span className="opacity-30 flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary font-mono text-[10px]">←</kbd>
          prev
        </span>
      )}
      {nextHref ? (
        <span className="flex items-center gap-1">
          next
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary font-mono text-[10px]">→</kbd>
        </span>
      ) : (
        <span className="opacity-30 flex items-center gap-1">
          next
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary font-mono text-[10px]">→</kbd>
        </span>
      )}
    </div>
  )
}
