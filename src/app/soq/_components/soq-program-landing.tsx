"use client"

import { useMemo, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, TrendingUp, LineChart, LogOut, Trophy, Clock } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { SoQPhaseWithTopics, UserProfile, LeaderboardEntry } from "@/lib/soq-api"
import { ProfileButton } from "./profile-button"
import { Leaderboard } from "./leaderboard"
import { LinkedInShareButton } from "./linkedin-share-button"

import Star1 from "@/examples/stars/s1"
import Star13 from "@/examples/stars/s13"
import Star29 from "@/examples/stars/s29"
import React from "react"

// ---------------------------------------------------------------------------
// Decorative helpers
// ---------------------------------------------------------------------------

const AnimatedStar = ({
  StarComponent, size, color, initialX, initialY, animateY, duration, delay = 0,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  StarComponent: React.ComponentType<any>
  size: number; color: string; initialX: string; initialY: string
  animateY?: number; duration: number; delay?: number
}) => {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="absolute z-0 pointer-events-none"
      style={{ top: initialY, left: initialX }}
      initial={reduce ? false : { opacity: 0, scale: 0 }}
      animate={reduce ? { opacity: 0.3 } : { opacity: [0.2, 0.5, 0.2], scale: [0.8, 1, 0.8], y: animateY ? [0, animateY, 0] : 0 }}
      transition={reduce ? { duration: 0 } : { repeat: Infinity, duration, delay, ease: "easeInOut" }}
    >
      <StarComponent size={size} color={color} />
    </motion.div>
  )
}

const FloatingIcon = ({ icon: Icon, top, left, delay = 0 }: { icon: React.ElementType; top: string; left: string; delay?: number }) => {
  const reduce = useReducedMotion()
  return (
    <motion.div className="absolute text-main/20 z-0" style={{ top, left }}
      initial={reduce ? false : { y: 20, opacity: 0 }}
      animate={reduce ? { opacity: 0.2 } : { y: [0, -15, 0], opacity: [0.15, 0.25, 0.15] }}
      transition={reduce ? { duration: 0 } : { duration: 5, repeat: Infinity, delay }}>
      <Icon size={32} />
    </motion.div>
  )
}

const ParticleBackground = () => {
  const reduce = useReducedMotion()
  const particles = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({
      id: i, x: `${(i * 19 + 13) % 100}%`, y: `${(i * 23 + 37) % 100}%`,
      size: ((i * 3 + 5) % 6) + 4, duration: 18 + i * 2,
    })), [],
  )
  if (reduce) return null
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-main opacity-10"
          style={{ width: p.size, height: p.size, left: p.x, top: p.y }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.id * 1.2 }} />
      ))}
    </div>
  )
}

const phaseColors = ["bg-main", "bg-blue-500", "bg-purple-500", "bg-orange-500"]

// ---------------------------------------------------------------------------
// Main landing component
// ---------------------------------------------------------------------------

interface Props {
  phases: SoQPhaseWithTopics[]
  userEmail: string | null
  userId: string | null
  completedTopicIds: number[]
  lastVisited: { phaseSlug: string; topicSlug: string; topicTitle: string } | null
  userProfile: Omit<UserProfile, "id"> | null
  leaderboard: LeaderboardEntry[]
}

export function SoQProgramLanding({
  phases,
  userEmail,
  userId,
  completedTopicIds,
  lastVisited,
  userProfile,
  leaderboard,
}: Props) {
  const totalTopics = phases.reduce((sum, p) => sum + p.topics.length, 0)
  const completedCount = completedTopicIds.length
  const overallPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  // Ref attached to the shareable section (progress bar + leaderboard)
  const shareRef = useRef<HTMLDivElement>(null)

  const isProfileComplete = useMemo(() => {
    if (!userProfile) return false
    const fields: (keyof Omit<UserProfile, "id">)[] = [
      "fullName",
      "university",
      "email",
      "phone",
      "gender",
    ]
    return fields.every((f) => {
      const v = userProfile[f]
      return v !== null && v !== undefined && String(v).trim() !== ""
    })
  }, [userProfile])

  return (
    <div className="pt-[70px] pb-16 bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-dvh">
      <div className="container max-w-6xl mx-auto relative px-5 py-8 md:py-12">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <AnimatedStar StarComponent={Star1}  size={24} color="var(--color-main)" initialX="6%"  initialY="14%" animateY={-20} duration={10} />
          <AnimatedStar StarComponent={Star13} size={28} color="var(--color-main)" initialX="78%" initialY="22%" animateY={-15} duration={11} delay={1.5} />
          <AnimatedStar StarComponent={Star29} size={30} color="var(--color-main)" initialX="88%" initialY="56%" animateY={-15} duration={12} delay={2} />
        </div>
        <ParticleBackground />
        <FloatingIcon icon={TrendingUp} top="14%" left="6%"  delay={0} />
        <FloatingIcon icon={LineChart}  top="56%" left="92%" delay={2} />

        {/* Shareable section: header + progress bar + phase grid */}
        <div ref={shareRef} className="bg-background">
        {/* Header row */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-main text-main-foreground border-2 border-border shadow-shadow text-xs font-heading rounded-base">
              Program Active · Summer 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-3">
              Summer of Quant
            </h1>
            <p className="text-lg text-foreground/60 max-w-xl">
              Choose a phase below to explore topics and access your learning materials.
            </p>
            {userEmail && (
              <p className="mt-3 text-sm text-foreground/40">
                Signed in as <span className="font-heading text-foreground/70">{userEmail}</span>
              </p>
            )}
            {lastVisited && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <Link href={`/soq/${lastVisited.phaseSlug}/${lastVisited.topicSlug}`}>
                  <Button variant="default" size="sm" className="gap-2 bg-main text-main-foreground border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
                    Continue: {lastVisited.topicTitle}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Profile + Sign out buttons */}
          {userEmail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <ProfileButton initialProfile={userProfile} />
              <form action="/soq/logout" method="POST">
                <Button variant="neutral" size="sm" type="submit">
                  <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign out
                </Button>
              </form>
            </motion.div>
          )}
        </div>

        {/* Overall progress bar */}
        {userEmail && totalTopics > 0 && (
          <motion.div
            className="relative z-10 mb-8 p-4 border-4 border-border shadow-shadow rounded-base bg-background"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-sm font-heading whitespace-nowrap">Overall Progress</span>
              <span className="text-sm font-heading tabular-nums whitespace-nowrap">
                {completedCount} / {totalTopics} topics
              </span>
            </div>
            <div className="h-3 w-full rounded-base border-2 border-border bg-secondary overflow-hidden">
              <motion.div
                className="h-full bg-main rounded-base"
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-foreground/40 mt-1.5">{overallPct}% complete</p>
          </motion.div>
        )}

        {/* Certificate of completion */}
        {userEmail && completedCount === totalTopics && totalTopics > 0 && (
          <motion.div
            className="relative z-10 mb-8 p-6 border-4 border-border shadow-shadow rounded-base bg-main/10 text-center print:border-2 print:shadow-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow">
                <Trophy className="h-8 w-8 text-main-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-heading font-bold tracking-tight mb-1">You completed Summer of Quant!</h2>
            <p className="text-sm text-foreground/60 mb-1">{userEmail}</p>
            <p className="text-xs text-foreground/40">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </motion.div>
        )}

        {/* Phase grid */}
        <div className="relative z-10 grid sm:grid-cols-2 gap-6">
          {phases.map((phase, i) => {
            const phaseCompleted = phase.topics.filter((t) => completedTopicIds.includes(t.id)).length
            const phasePct = phase.topics.length > 0 ? Math.round((phaseCompleted / phase.topics.length) * 100) : 0
            const totalMinutes = phase.topics.reduce((sum, t) => sum + t.readingTimeMinutes, 0)
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                whileHover={{ translateX: 4, translateY: 4, boxShadow: "none", transition: { duration: 0.15 } }}
              >
                <Link href={`/soq/${phase.slug}`} className="block h-full">
                  <Card className="border-4 border-border shadow-shadow h-full cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-base border-4 border-border shadow-shadow ${phaseColors[i % phaseColors.length]}`}>
                          <span className="text-sm font-heading text-white">{i + 1}</span>
                        </div>
                        <CardTitle className="font-heading text-lg group-hover:text-main transition-colors">
                          {phase.title}
                        </CardTitle>
                      </div>
                      {phase.description && (
                        <CardDescription className="text-foreground/60 text-sm leading-relaxed">
                          {phase.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                        <Clock className="h-3 w-3" />
                        <span>~{totalMinutes} min · {phase.topics.length} topics</span>
                      </div>
                      {userEmail && phase.topics.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-foreground/50">{phaseCompleted}/{phase.topics.length} topics</span>
                            <span className="text-xs text-foreground/50">{phasePct}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-base border border-border bg-secondary overflow-hidden">
                            <motion.div
                              className="h-full bg-main rounded-base"
                              initial={{ width: 0 }}
                              animate={{ width: `${phasePct}%` }}
                              transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm font-heading text-main">
                        Explore topics
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
        {/* end shareRef — header + progress + phases captured above */}
        </div>

        {/* Leaderboard — below the shareable section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Leaderboard
            entries={leaderboard}
            currentUserId={userId}
            isProfileComplete={isProfileComplete}
            action={
              userEmail && isProfileComplete ? (
                <LinkedInShareButton
                  captureRef={shareRef}
                  userName={userProfile?.fullName}
                  completedCount={completedCount}
                  totalTopics={totalTopics}
                />
              ) : undefined
            }
          />
        </motion.div>
      </div>
    </div>
  )
}
