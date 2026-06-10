"use client"

import { motion } from "framer-motion"
import { Trophy, User } from "lucide-react"
import type { LeaderboardEntry } from "@/lib/soq-api"

const SHOW_LEADERBOARD = true // SET TO FALSE TO SHOW "COMING SOON"

const TOP_N = 10

const RANK_COLORS = [
  "bg-yellow-400 border-yellow-500 text-yellow-900",  // 1st – gold
  "bg-slate-300 border-slate-400 text-slate-800",      // 2nd – silver
  "bg-amber-600 border-amber-700 text-amber-100",      // 3rd – bronze
]

interface LeaderboardProps {
  entries: LeaderboardEntry[]          // full sorted list from the server
  currentUserId?: string | null
  isProfileComplete?: boolean
  action?: React.ReactNode
}

export function Leaderboard({
  entries,
  currentUserId,
  isProfileComplete = false,
  action,
}: LeaderboardProps) {
  if (!isProfileComplete) {
    return (
      <div className="relative z-10 mt-10">
        <SectionHeader description="Complete your profile to participate" action={action} />
        <div className="flex flex-col items-center justify-center p-8 border-4 border-border rounded-base bg-background text-center mt-4 shadow-shadow">
          <User className="h-10 w-10 text-main mb-3 animate-bounce" />
          <h3 className="font-heading text-lg font-bold">Leaderboard Locked</h3>
          <p className="text-xs text-foreground/50 max-w-sm mt-1.5 leading-relaxed">
            Complete the profile to participate in leaderboard
          </p>
          <button
            onClick={() => document.getElementById("soq-profile-btn")?.click()}
            className="mt-4 px-4 py-2 text-xs font-heading font-bold rounded-base border-2 border-border bg-main text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
          >
            Complete Profile
          </button>
        </div>
      </div>
    )
  }

  if (!SHOW_LEADERBOARD) {
    return (
      <div className="relative z-10 mt-10">
        <SectionHeader description="Rankings will be revealed soon" action={action} />
        <div className="flex flex-col items-center justify-center p-8 border-4 border-border rounded-base bg-background text-center mt-4 shadow-shadow">
          <Trophy className="h-10 w-10 text-foreground/30 mb-3 animate-pulse" />
          <h3 className="font-heading text-lg font-bold">Leaderboard Coming Soon</h3>
          <p className="text-xs text-foreground/50 max-w-sm mt-1.5 leading-relaxed">
            Fill in your profile and continue learning and secure your place on the board when it goes live!
          </p>
        </div>
      </div>
    )
  }

  const top10 = entries.slice(0, TOP_N)

  // Find current user's global rank (0-indexed, -1 = not found / profile incomplete)
  const currentUserRank = currentUserId
    ? entries.findIndex((e) => e.id === currentUserId)
    : -1

  const currentUserEntry = currentUserRank >= 0 ? entries[currentUserRank] : null
  const currentUserInTop10 = currentUserRank >= 0 && currentUserRank < TOP_N
  // Show "your rank" card below #10 only when user is ranked but outside top 10
  const showSelfBelow = currentUserEntry !== null && !currentUserInTop10

  if (top10.length === 0 && !showSelfBelow) {
    return (
      <div className="relative z-10 mt-10">
        <SectionHeader action={action} />
        <p className="text-sm text-foreground/40 text-center py-8">
          No entries yet — complete your profile and finish topics to appear here!
        </p>
      </div>
    )
  }

  return (
    <div className="relative z-10 mt-10">
      <SectionHeader action={action} />
      <div className="grid gap-3 mt-4">
        {top10.map((entry, i) => (
          <LeaderboardCard
            key={entry.id}
            entry={entry}
            rank={i + 1}
            index={i}
            isCurrentUser={entry.id === currentUserId}
          />
        ))}

        {/* Current user's card below #10 if they're ranked but outside top 10 */}
        {showSelfBelow && (
          <>
            {/* Dashed separator */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 border-t-2 border-dashed border-border/40" />
              <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-heading">
                your rank
              </span>
              <div className="flex-1 border-t-2 border-dashed border-border/40" />
            </div>
            <LeaderboardCard
              entry={currentUserEntry!}
              rank={currentUserRank + 1}
              index={0}
              isCurrentUser
            />
          </>
        )}
      </div>
    </div>
  )
}

function SectionHeader({
  description = "Top 10",
  action,
}: {
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow shrink-0">
          <Trophy className="h-4 w-4 text-main-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-bold tracking-tight leading-none">
            Leaderboard
          </h2>
          <p className="text-xs text-foreground/50 mt-0.5">{description}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

function LeaderboardCard({
  entry,
  rank,
  index,
  isCurrentUser = false,
}: {
  entry: LeaderboardEntry
  rank: number
  index: number
  isCurrentUser?: boolean
}) {
  const medalClass =
    rank <= 3
      ? RANK_COLORS[rank - 1]
      : "bg-secondary-background border-border text-foreground"

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-base border-2 shadow-shadow bg-background transition-colors
        ${isCurrentUser ? "border-main" : "border-border"}`}
    >
      {/* Rank badge */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-base border-2 font-heading font-bold text-sm ${medalClass}`}
      >
        {rank <= 3 ? (
          <Trophy className="h-4 w-4" />
        ) : (
          <span>{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-secondary-background
          ${isCurrentUser ? "border-main" : "border-border"}`}
      >
        <User className={`h-5 w-5 ${isCurrentUser ? "text-main" : "text-foreground/60"}`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-heading text-sm font-bold truncate leading-none ${isCurrentUser ? "text-main" : ""}`}>
          {entry.fullName}
          {isCurrentUser && (
            <span className="ml-1.5 text-[10px] font-heading font-normal text-main/70 uppercase tracking-wider">
              you
            </span>
          )}
        </p>
        <p className="text-xs text-foreground/50 truncate mt-0.5">{entry.university}</p>
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        <p className={`font-heading font-bold text-sm tabular-nums ${isCurrentUser ? "text-main" : "text-main"}`}>
          {entry.completedCount}
        </p>
        <p className="text-[10px] text-foreground/40 leading-none">topics</p>
      </div>
    </div>
  )
}
