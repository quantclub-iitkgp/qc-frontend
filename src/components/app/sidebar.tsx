"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { MAIN_SIDEBAR } from "@/data/sidebar-links"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      className="scrollbar fixed top-[70px] bg-secondary-background h-[calc(100svh-70px)] max-h-[calc(100svh-70px)] w-[250px] overflow-y-auto border-r-4 lg:block hidden border-border"
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {MAIN_SIDEBAR.map((item, id) => {
        if (typeof item === "string") {
          return (
            <div
              key={id}
              className="block border-b-4 border-border p-4 text-xl font-heading"
            >
              {item}
            </div>
          )
        }

        const isActive = item.href === pathname

        return (
          <Link
            key={id}
            href={`${item.href}`}
            className={cn(
              "relative block border-b-4 border-border p-4 pl-7 text-lg font-base transition-colors",
              isActive
                ? "text-main-foreground"
                : "text-foreground/90 hover:text-main-foreground",
            )}
          >
            {/* Sliding active background */}
            {isActive && (
              <motion.span
                layoutId="sidebarActiveIndicator"
                className="absolute inset-0 bg-main -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            {/* Hover background for non-active */}
            {!isActive && (
              <span className="absolute inset-0 bg-main/70 opacity-0 hover:opacity-100 transition-opacity -z-10" />
            )}
            {item.text}
          </Link>
        )
      })}
    </motion.aside>
  )
}
