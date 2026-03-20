"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Search, Menu, Lock, BookOpen } from "lucide-react"
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
      <div className="px-4 py-3 border-b-4 border-border flex items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main shadow-[2px_2px_0px_0px_black]">
          <BookOpen className="h-3.5 w-3.5 text-main-foreground" />
        </div>
        <div>
          <p className="font-heading font-bold text-sm leading-tight">Summer of Quant</p>
          <p className="text-[10px] text-foreground/50 leading-tight">Elementary Program</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b-2 border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/40" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm border-2 border-border rounded-base bg-background"
          />
        </div>
      </div>

      {/* Phase list */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        {filteredPhases.map((phase) => (
          <div key={phase.id}>
            {/* Phase header */}
            <div className="flex items-center justify-between px-2 mb-1.5">
              <p className="font-heading font-bold text-xs uppercase tracking-widest text-foreground/60">
                {phase.title}
              </p>
              <span className="text-[10px] font-base text-foreground/40 tabular-nums">
                {phase.topics.length}
              </span>
            </div>
            {/* Divider */}
            <div className="h-px bg-border/30 mx-2 mb-1.5" />
            <ul className="space-y-0.5">
              {phase.topics.map((topic) => {
                const isActive =
                  params.phase === phase.slug && params.topic === topic.slug
                return (
                  <li key={topic.id}>
                    <Link
                      href={`/soq/${phase.slug}/${topic.slug}`}
                      className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-base transition-all duration-150 ${
                        isActive
                          ? "bg-main text-main-foreground font-medium border-2 border-border shadow-[2px_2px_0px_0px_black]"
                          : "text-foreground/70 hover:text-foreground hover:bg-secondary-background border-2 border-transparent hover:border-border"
                      }`}
                    >
                      <span className="truncate">{topic.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {filteredPhases.length === 0 && (
          <p className="text-sm text-foreground/40 px-2 py-4 text-center">
            No topics match your search.
          </p>
        )}
      </nav>

      {/* Enrollment notice */}
      {!enrolled && (
        <div className="p-3 border-t-2 border-border">
          <div className="flex items-start gap-2.5 p-2.5 rounded-base border-2 border-border bg-main/5 shadow-[2px_2px_0px_0px_black]">
            <Lock className="h-3.5 w-3.5 text-main shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-heading font-bold">Enroll to view content</p>
              <Link
                href="/soq/login"
                className="text-xs text-foreground/60 underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Sign in to your account
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
