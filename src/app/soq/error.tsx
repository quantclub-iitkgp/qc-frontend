"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SoQError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-dvh pt-[70px] flex items-center justify-center px-5 bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
      <div className="text-center max-w-sm border-4 border-border shadow-shadow rounded-base p-8 bg-background">
        <h2 className="text-2xl font-heading mb-3">Something went wrong</h2>
        <p className="text-foreground/60 mb-6 text-sm">An error occurred loading this page.</p>
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
