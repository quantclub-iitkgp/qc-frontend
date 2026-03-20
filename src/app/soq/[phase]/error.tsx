"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PhaseError({ reset }: { reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh] px-5">
      <div className="text-center max-w-sm border-4 border-border shadow-shadow rounded-base p-8 bg-background">
        <h2 className="text-2xl font-heading mb-3">Something went wrong</h2>
        <p className="text-foreground/60 mb-6 text-sm">An error occurred loading this content.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Link href="/soq">
            <Button variant="neutral">Back to SoQ</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
