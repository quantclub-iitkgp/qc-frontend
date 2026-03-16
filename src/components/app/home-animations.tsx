"use client"

import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, cardItem } from "@/lib/motion"

/**
 * Hero heading — animates on mount (above fold)
 */
export function HeroHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Hero subtitle paragraph
 */
export function HeroSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Hero CTA button
 */
export function HeroCTA({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Floating star decoration — loops gently
 */
export function FloatingStar({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
      className="inline-block"
      style={{ display: "contents" }}
    >
      {children}
    </motion.span>
  )
}

/**
 * Scroll-triggered section wrapper
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={
        delay > 0
          ? {
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
              },
            }
          : fadeInUp
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger container for features grid
 */
export function FeaturesStagger({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  )
}

export function FeatureItem({ children }: { children: React.ReactNode }) {
  return <motion.div variants={cardItem}>{children}</motion.div>
}
