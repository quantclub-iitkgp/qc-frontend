"use client"

import { useEffect, useState } from "react"

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const main = document.querySelector("main")
    if (!main) return
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = main
      const pct =
        scrollHeight > clientHeight
          ? (scrollTop / (scrollHeight - clientHeight)) * 100
          : 0
      setProgress(pct)
    }
    main.addEventListener("scroll", update, { passive: true })
    return () => main.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="fixed top-[70px] left-0 right-0 z-50 h-[3px] bg-border pointer-events-none">
      <div
        className="h-full bg-main transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
