"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { TrendingUp, BarChart4, LineChart, Sigma } from "lucide-react"
import React from "react"

import Star1 from "@/examples/stars/s1"
import Star13 from "@/examples/stars/s13"
import Star21 from "@/examples/stars/s21"
import Star29 from "@/examples/stars/s29"

const AnimatedStar = ({
  StarComponent,
  size,
  color,
  initialX,
  initialY,
  animateY,
  duration,
  delay = 0,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  StarComponent: React.ComponentType<any>
  size: number
  color: string
  initialX: string
  initialY: string
  animateY?: number
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
      y: animateY ? [0, animateY, 0] : 0,
    }}
    transition={{ repeat: Infinity, duration, delay, ease: "easeInOut" }}
  >
    <StarComponent size={size} color={color} />
  </motion.div>
)

const FloatingIcon = ({
  icon: Icon,
  top,
  left,
  delay = 0,
}: {
  icon: React.ElementType
  top: string
  left: string
  delay?: number
}) => (
  <motion.div
    className="absolute text-main/20 z-0"
    style={{ top, left }}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: [0, -15, 0], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 7, repeat: Infinity, delay }}
  >
    <Icon size={32} />
  </motion.div>
)

const ParticleField = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: `${(i * 17 + 13) % 100}%`,
        y: `${(i * 23 + 37) % 100}%`,
        size: ((i * 3 + 5) % 6) + 4,
        duration: 18 + (i * 2),
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
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.id * 1.2 }}
        />
      ))}
    </div>
  )
}

export function WaitlistBackground() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <AnimatedStar StarComponent={Star1}  size={24} color="var(--color-main)" initialX="8%"  initialY="18%" animateY={-20} duration={10} />
        <AnimatedStar StarComponent={Star13} size={28} color="var(--color-main)" initialX="42%" initialY="22%" animateY={-15} duration={11} delay={2} />
        <AnimatedStar StarComponent={Star21} size={22} color="var(--color-main)" initialX="65%" initialY="68%" animateY={20}  duration={12} delay={1} />
        <AnimatedStar StarComponent={Star29} size={30} color="var(--color-main)" initialX="88%" initialY="30%" animateY={-15} duration={11} delay={2.5} />
      </div>
      <ParticleField />
      <FloatingIcon icon={TrendingUp} top="14%" left="6%" delay={0} />
      <FloatingIcon icon={BarChart4}  top="72%" left="90%" delay={1.5} />
      <FloatingIcon icon={LineChart}  top="36%" left="84%" delay={3} />
      <FloatingIcon icon={Sigma}      top="58%" left="3%"  delay={2} />
    </>
  )
}
