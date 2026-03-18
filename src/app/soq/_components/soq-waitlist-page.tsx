"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  TrendingUp,
  Users,
  Award,
  Clock,
  BarChart4,
  LineChart,
  Sigma,
  CalendarDays,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WaitlistForm } from "./waitlist-form"

import Star1 from "@/examples/stars/s1"
import Star6 from "@/examples/stars/s6"
import Star9 from "@/examples/stars/s9"
import Star13 from "@/examples/stars/s13"
import Star21 from "@/examples/stars/s21"
import Star29 from "@/examples/stars/s29"
import Star32 from "@/examples/stars/s32"
import Star35 from "@/examples/stars/s35"
import React from "react"

// ---- Background components (same pattern as contactus/page.tsx) ----

const AnimatedStar = ({
  StarComponent,
  size,
  color,
  initialX,
  initialY,
  animateX,
  animateY,
  duration,
  delay = 0,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  StarComponent: React.ComponentType<any>
  size: number
  color: string
  initialX: string | number
  initialY: string | number
  animateX?: string | number
  animateY?: string | number
  duration: number
  delay?: number
}) => (
  <motion.div
    className="absolute z-0 pointer-events-none"
    style={{ top: initialY, left: initialX }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.2, 0.5, 0.2],
      scale: [0.8, 1, 0.8],
      x: animateX ? [0, animateX, 0] : 0,
      y: animateY ? [0, animateY, 0] : 0,
    }}
    transition={{ repeat: Infinity, duration, delay, ease: "easeInOut" }}
  >
    <StarComponent size={size} color={color} />
  </motion.div>
)

const StarBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <AnimatedStar StarComponent={Star1}  size={24} color="var(--color-main)" initialX="5%"  initialY="15%" animateY={-20} duration={8} />
    <AnimatedStar StarComponent={Star6}  size={30} color="var(--color-main)" initialX="15%" initialY="40%" animateY={30}  duration={12} delay={2} />
    <AnimatedStar StarComponent={Star9}  size={18} color="var(--color-main)" initialX="25%" initialY="70%" animateX={20}  duration={10} delay={1} />
    <AnimatedStar StarComponent={Star13} size={28} color="var(--color-main)" initialX="40%" initialY="20%" animateY={-15} duration={9}  delay={3} />
    <AnimatedStar StarComponent={Star21} size={22} color="var(--color-main)" initialX="60%" initialY="65%" animateY={20}  duration={11} />
    <AnimatedStar StarComponent={Star29} size={32} color="var(--color-main)" initialX="75%" initialY="30%" animateX={-20} duration={10} delay={2} />
    <AnimatedStar StarComponent={Star32} size={20} color="var(--color-main)" initialX="85%" initialY="75%" animateY={-25} duration={8}  delay={1.5} />
    <AnimatedStar StarComponent={Star35} size={26} color="var(--color-main)" initialX="90%" initialY="10%" animateY={15}  duration={9}  delay={0.5} />
    <AnimatedStar StarComponent={Star1}  size={16} color="var(--color-main)" initialX="10%" initialY="85%" animateX={15}  duration={7}  delay={1} />
    <AnimatedStar StarComponent={Star6}  size={24} color="var(--color-main)" initialX="55%" initialY="45%" animateY={-10} duration={8.5} delay={2.5} />
  </div>
)

const ParticleBackground = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: `${(i * 7 + 13) % 100}%`,
        y: `${(i * 11 + 37) % 100}%`,
        size: ((i * 3 + 61) % 8) + 4,
        duration: 15 + (i % 12),
      })),
    [],
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-main opacity-10"
          style={{ width: p.size, height: p.size, left: p.x, top: p.y }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: (p.id % 5) * 0.8 }}
        />
      ))}
    </div>
  )
}

const FloatingIcon = ({ icon: Icon, top, left, delay = 0 }: { icon: React.ElementType; top: string; left: string; delay?: number }) => (
  <motion.div
    className="absolute text-main/20 z-0"
    style={{ top, left }}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: [0, -15, 0], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 5, repeat: Infinity, delay }}
  >
    <Icon size={32} />
  </motion.div>
)

// ---- Features ----
const features = [
  {
    icon: Clock,
    title: "12 Weeks",
    description: "Structured, phase-wise curriculum from fundamentals to advanced ML strategies.",
  },
  {
    icon: BookOpen,
    title: "4 Phases",
    description: "Foundations → Markets → Trading Strategies → Risk & Machine Learning.",
  },
  {
    icon: Users,
    title: "Live Sessions",
    description: "Weekly live sessions with Quant Club members and industry practitioners.",
  },
  {
    icon: Award,
    title: "Certificate",
    description: "Earn a certificate from Quant Club IIT Kharagpur upon completion.",
  },
]

// ---- Timeline ----
const timeline = [
  { date: "June 2025",       label: "Applications open" },
  { date: "Late June 2025",  label: "Program kickoff" },
  { date: "July – Aug 2025", label: "Phase sessions" },
  { date: "August 2025",     label: "Final project & certificates" },
]

export function SoQWaitlistPage() {
  return (
    <div className="pt-[70px] pb-16 bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-dvh">
      <div className="container max-w-6xl mx-auto relative px-5 py-12">
        <StarBackground />
        <ParticleBackground />
        <FloatingIcon icon={TrendingUp} top="12%" left="8%"  delay={0} />
        <FloatingIcon icon={BarChart4}  top="70%" left="88%" delay={1} />
        <FloatingIcon icon={LineChart}  top="35%" left="80%" delay={2} />
        <FloatingIcon icon={Sigma}      top="55%" left="4%"  delay={1.5} />

        {/* ---- Hero ---- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-main text-main-foreground border-2 border-border shadow-shadow text-sm font-heading rounded-base"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Applications Opening Soon · Summer 2025
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-none">
            Summer of{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Quant</span>
              <motion.span
                className="absolute inset-x-0 bottom-1 h-3 bg-main/30 -z-0 rounded-sm"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              />
            </span>
          </h1>

          <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            A 12-week intensive program by{" "}
            <span className="font-heading text-foreground">Quant Club IIT Kharagpur</span>{" "}
            covering quantitative finance, systematic trading, and machine learning for markets.
          </p>
        </motion.div>

        {/* ---- Two-column: features + form ---- */}
        <div className="grid lg:grid-cols-5 gap-8 relative z-10 mb-16">
          {/* Feature cards — 3 cols */}
          <motion.div
            className="lg:col-span-3 grid sm:grid-cols-2 gap-4 content-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                whileHover={{
                  translateX: 4,
                  translateY: 4,
                  boxShadow: "none",
                  transition: { duration: 0.15 },
                }}
              >
                <Card className="border-4 border-border shadow-shadow h-full">
                  <CardContent className="pt-6">
                    <div className="flex h-10 w-10 items-center justify-center border-4 border-border bg-main shadow-shadow mb-4 rounded-base">
                      <f.icon className="h-5 w-5 text-main-foreground" />
                    </div>
                    <h3 className="font-heading text-lg mb-1">{f.title}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">{f.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Waitlist form — 2 cols */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-4 border-border shadow-shadow sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Reserve Your Spot</CardTitle>
                <CardDescription className="text-foreground/60">
                  Be first to know when applications open. No spam — just the signal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WaitlistForm />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ---- Timeline ---- */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-4 border-border shadow-shadow">
            <CardHeader className="text-center">
              <CardTitle className="font-heading">Program Timeline</CardTitle>
              <CardDescription className="text-foreground/60">What to expect, and when</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-4 gap-0">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-2 p-4 sm:text-center"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    {/* connector line */}
                    {i < timeline.length - 1 && (
                      <div className="hidden sm:block absolute right-0 top-[2.1rem] w-1/2 h-0.5 bg-border" />
                    )}
                    {i > 0 && (
                      <div className="hidden sm:block absolute left-0 top-[2.1rem] w-1/2 h-0.5 bg-border" />
                    )}
                    {/* dot */}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow">
                      <span className="text-xs font-heading text-main-foreground">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/50 font-base">{item.date}</p>
                      <p className="font-heading text-sm mt-0.5">{item.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
