// @ts-nocheck
"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface TocProps {
  items: Array<{
    depth: number
    value: string
    id: string
  }>
}

export function TableOfContents({ items }: TocProps) {
  const itemIds = React.useMemo(() => items.map((item) => item.id), [items])
  const activeHeading = useActiveItem(itemIds)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !items?.length) {
    return null
  }

  return (
    <div className="overflow-y-auto toc-scrollbar">
      <h3 className="text-xl p-3 pb-2 font-heading font-bold border-b-4 border-border mb-1">
        On this page
      </h3>
      <div>
        {items.map(({ depth, id, value }) => {
          const isActive = id === activeHeading
          return (
            <motion.a
              key={id}
              href={`#${id}`}
              className={cn(
                "relative block border-t-4 text-foreground border-t-border last:border-b-4 last:border-b-border font-base py-1.5 pr-3 overflow-hidden transition-colors",
                depth === 2 ? "pl-3" : depth === 3 ? "pl-6" : "pl-9",
                isActive
                  ? "text-main-foreground"
                  : "hover:text-main",
              )}
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {/* Sliding background highlight */}
              {isActive && (
                <motion.span
                  layoutId="tocActiveBackground"
                  className="absolute inset-0 bg-main -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative truncate block">{value}</span>
            </motion.a>
          )
        })}
      </div>
    </div>
  )
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0% -66%" },
    )

    itemIds?.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [itemIds])

  return activeId
}
