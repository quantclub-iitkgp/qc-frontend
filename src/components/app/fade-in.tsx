"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { fadeInUp, staggerContainer, cardItem } from "@/lib/motion"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Scroll-triggered fade-in wrapper for Server Component children.
 * Fires once when the element enters the viewport.
 */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
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
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger container — wraps a list of FadeInItem children.
 * Each child animates in with a stagger offset.
 */
export function FadeInStagger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

/**
 * Individual item inside a FadeInStagger container.
 * Uses cardItem variant (inherits stagger timing from parent).
 */
export function FadeInItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div variants={cardItem} className={cn(className)}>
      {children}
    </motion.div>
  )
}
