"use client"

import { createContext, useCallback, useContext, useState } from "react"

const KEY = "soq-visited-topics"

type Ctx = {
  visited: Set<number>
  markVisited: (id: number) => void
}

const SoQProgressCtx = createContext<Ctx>({
  visited: new Set(),
  markVisited: () => {},
})

export function SoQProgressProvider({ children }: { children: React.ReactNode }) {
  const [visited, setVisited] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set()
    try {
      const raw = localStorage.getItem(KEY)
      return new Set<number>(raw ? JSON.parse(raw) : [])
    } catch {
      return new Set()
    }
  })

  const markVisited = useCallback((id: number) => {
    setVisited((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      try {
        localStorage.setItem(KEY, JSON.stringify(Array.from(next)))
      } catch {
        // ignore storage errors
      }
      return next
    })
  }, [])

  return (
    <SoQProgressCtx.Provider value={{ visited, markVisited }}>
      {children}
    </SoQProgressCtx.Provider>
  )
}

export const useSoQProgress = () => useContext(SoQProgressCtx)
