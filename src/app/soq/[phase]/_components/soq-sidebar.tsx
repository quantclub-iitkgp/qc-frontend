"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Search, Menu, X, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import type { SoQPhaseWithTopics } from "@/lib/soq-api"

interface Props {
  phases: SoQPhaseWithTopics[]
  enrolled: boolean
}

function SidebarContent({ phases, enrolled }: Props) {
  const params = useParams<{ phase: string; topic?: string }>()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPhases = searchQuery.trim()
    ? phases
        .map((p) => ({
          ...p,
          topics: p.topics.filter((t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((p) => p.topics.length > 0)
    : phases

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b-4 border-border">
        <p className="font-heading font-bold text-sm uppercase tracking-wider">SoQ Resources</p>
      </div>

      {/* Search */}
      <div className="p-3 border-b-2 border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/40" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm border-2 border-border rounded-base"
          />
        </div>
      </div>

      {/* Phase list */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {filteredPhases.map((phase) => (
          <div key={phase.id}>
            <p className="font-heading font-bold text-xs uppercase tracking-wider text-foreground/50 px-2 mb-1">
              {phase.title}
            </p>
            <ul className="space-y-0.5">
              {phase.topics.map((topic) => {
                const isActive =
                  params.phase === phase.slug && params.topic === topic.slug
                return (
                  <li key={topic.id}>
                    <Link
                      href={`/soq/${phase.slug}/${topic.slug}`}
                      className={`block px-3 py-1.5 text-sm rounded-base border-2 transition-all ${
                        isActive
                          ? "bg-main text-main-foreground border-border font-medium"
                          : "border-transparent hover:bg-secondary hover:border-border"
                      }`}
                    >
                      {topic.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {filteredPhases.length === 0 && (
          <p className="text-sm text-foreground/40 px-2">No topics match your search.</p>
        )}
      </nav>

      {/* Enrollment notice */}
      {!enrolled && (
        <div className="p-3 border-t-2 border-border">
          <div className="flex items-start gap-2 p-2 rounded-base border-2 border-border bg-main/5">
            <Lock className="h-3.5 w-3.5 text-main shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-heading font-bold">Enroll to view content</p>
              <Link
                href="/soq/login"
                className="text-xs text-foreground/60 underline hover:text-foreground"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function SoQSidebar(props: Props) {
  return <SidebarContent {...props} />
}

export function MobileSidebarToggle(props: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="neutral"
          size="sm"
          className="lg:hidden fixed top-[78px] left-3 z-40 border-2 border-border shadow-shadow h-8 w-8 p-0"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 border-r-4 border-border">
        <SidebarContent {...props} />
      </SheetContent>
    </Sheet>
  )
}
