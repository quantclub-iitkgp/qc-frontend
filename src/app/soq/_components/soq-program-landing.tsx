"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, BarChart4, LineChart, Sigma, LogOut, Trophy, Clock } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { SoQPhaseWithTopics } from "@/lib/soq-api"

import Star1 from "@/examples/stars/s1"
import Star6 from "@/examples/stars/s6"
import Star13 from "@/examples/stars/s13"
import Star21 from "@/examples/stars/s21"
import Star29 from "@/examples/stars/s29"
import Star32 from "@/examples/stars/s32"
import React from "react"

const AnimatedStar = ({
  StarComponent, size, color, initialX, initialY, animateY, duration, delay = 0,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  StarComponent: React.ComponentType<any>
  size: number; color: string; initialX: string; initialY: string
  animateY?: number; duration: number; delay?: number
}) => (
  <motion.div
    className="absolute z-0 pointer-events-none"
    style={{ top: initialY, left: initialX }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1, 0.8], y: animateY ? [0, animateY, 0] : 0 }}
    transition={{ repeat: Infinity, duration, delay, ease: "easeInOut" }}
  >
    <StarComponent size={size} color={color} />
  </motion.div>
)

const FloatingIcon = ({ icon: Icon, top, left, delay = 0 }: { icon: React.ElementType; top: string; left: string; delay?: number }) => (
  <motion.div className="absolute text-main/20 z-0" style={{ top, left }}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: [0, -15, 0], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 5, repeat: Infinity, delay }}>
    <Icon size={32} />
  </motion.div>
)

const ParticleBackground = () => {
  const particles = useMemo(
    () => Array.from({ length: 20 }, (_, i) => ({
      id: i, x: `${(i * 7 + 13) % 100}%`, y: `${(i * 11 + 37) % 100}%`,
      size: ((i * 3 + 61) % 8) + 4, duration: 15 + (i % 12),
    })), [],
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-main opacity-10"
          style={{ width: p.size, height: p.size, left: p.x, top: p.y }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: (p.id % 5) * 0.8 }} />
      ))}
    </div>
  )
}

const phaseColors = ["bg-main", "bg-blue-500", "bg-purple-500", "bg-orange-500"]

interface Props {
  phasesWithTopics: SoQPhaseWithTopics[]
  userEmail: string | null
  completedTopicIds: number[]
  lastVisited: { phaseSlug: string; topicSlug: string; topicTitle: string } | null
}

export function SoQProgramLanding({ phasesWithTopics, userEmail, completedTopicIds, lastVisited }: Props) {
  const totalTopics = phasesWithTopics.reduce((sum, p) => sum + p.topics.length, 0)
  const completedCount = completedTopicIds.length
  const overallPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0
  return (
    <div className="pt-[70px] pb-16 bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-dvh">
      <div className="container max-w-6xl mx-auto relative px-5 py-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <AnimatedStar StarComponent={Star1}  size={24} color="var(--color-main)" initialX="5%"  initialY="10%" animateY={-20} duration={8} />
          <AnimatedStar StarComponent={Star6}  size={30} color="var(--color-main)" initialX="15%" initialY="40%" animateY={30}  duration={12} delay={2} />
          <AnimatedStar StarComponent={Star13} size={28} color="var(--color-main)" initialX="80%" initialY="20%" animateY={-15} duration={9}  delay={1} />
          <AnimatedStar StarComponent={Star21} size={22} color="var(--color-main)" initialX="60%" initialY="65%" animateY={20}  duration={11} />
          <AnimatedStar StarComponent={Star29} size={32} color="var(--color-main)" initialX="90%" initialY="50%" animateY={-20} duration={10} delay={2} />
          <AnimatedStar StarComponent={Star32} size={20} color="var(--color-main)" initialX="45%" initialY="80%" animateY={-25} duration={8}  delay={1.5} />
        </div>
        <ParticleBackground />
        <FloatingIcon icon={TrendingUp} top="12%" left="8%"  delay={0} />
        <FloatingIcon icon={BarChart4}  top="70%" left="88%" delay={1} />
        <FloatingIcon icon={LineChart}  top="35%" left="82%" delay={2} />
        <FloatingIcon icon={Sigma}      top="55%" left="3%"  delay={1.5} />

        {/* Header row */}
        <div className="relative z-10 flex items-start justify-between mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-main text-main-foreground border-2 border-border shadow-shadow text-xs font-heading rounded-base">
              Program Active · Summer 2025
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

          {userEmail && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
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
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-heading">Overall Progress</span>
              <span className="text-sm font-heading tabular-nums">
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
            <p className="text-xs text-foreground/40 mb-4">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            <Button
              variant="neutral"
              size="sm"
              onClick={() => window.print()}
              className="border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
            >
              Print Certificate
            </Button>
          </motion.div>
        )}

        {/* Phase grid */}
        <div className="relative z-10 grid sm:grid-cols-2 gap-6">
          {phasesWithTopics.map((phase, i) => {
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
      </div>
    </div>
  )
}
