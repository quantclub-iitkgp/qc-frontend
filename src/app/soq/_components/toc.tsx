"use client"

import { useEffect, useRef, useState } from "react"

interface Heading {
  level: number
  text: string
  id: string
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

function extractHeadings(body: string): Heading[] {
  const matches = body.matchAll(/^(#{1,3}) (.+)/gm)
  return Array.from(matches).map((m) => ({
    level: m[1].length,
    text: m[2].trim(),
    id: slugifyHeading(m[2].trim()),
  }))
}

export function TOC({ body }: { body: string }) {
  const headings = extractHeadings(body)
  const [activeId, setActiveId] = useState<string>("")
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    observerRef.current?.disconnect()

    const callback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
          break
        }
      }
    }

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: "-10% 0px -80% 0px",
    })

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body])

  if (headings.length === 0) return null

  return (
    <nav className="hidden lg:block sticky top-8 w-52 shrink-0 self-start">
      <p className="text-xs font-heading uppercase tracking-widest text-foreground/40 mb-3">On this page</p>
      <ul className="space-y-1 border-l-2 border-border">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={[
                "block py-0.5 text-sm transition-colors leading-snug",
                level === 1 ? "pl-3" : level === 2 ? "pl-3" : "pl-6",
                activeId === id
                  ? "text-main font-medium border-l-2 border-main -ml-[2px]"
                  : "text-foreground/50 hover:text-foreground",
              ].join(" ")}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
