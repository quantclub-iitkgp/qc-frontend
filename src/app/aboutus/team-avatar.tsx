"use client"

import { useState } from "react"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Team photos come from arbitrary hosts (admin uploads or imported URLs), so we
// use a plain <img> instead of next/image remote patterns. Signed URLs (e.g.
// LinkedIn CDN) can expire, so on load error we fall back to initials.
export function TeamAvatar({ name, image }: { name: string; image: string }) {
  const [failed, setFailed] = useState(false)

  if (!image || failed) {
    return (
      <div className="w-full aspect-square bg-main flex items-center justify-center border-b-4 border-border">
        <span className="text-4xl font-heading font-bold text-main-foreground">
          {getInitials(name)}
        </span>
      </div>
    )
  }

  return (
    <div className="w-full aspect-square border-b-4 border-border overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
