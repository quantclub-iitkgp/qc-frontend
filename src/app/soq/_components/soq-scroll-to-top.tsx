"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function SoQScrollToTop() {
  const pathname = usePathname()
  useEffect(() => {
    document.querySelector("main")?.scrollTo(0, 0)
  }, [pathname])
  return null
}
