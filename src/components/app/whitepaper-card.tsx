"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { motion } from "framer-motion"

import { type Whitepaper } from "@/data/whitepaper/paper"
import { formatDate } from "@/lib/utils"

interface WhitepaperCardProps {
  whitepaper: Whitepaper
  featured?: boolean
}

export function WhitepaperCard({ whitepaper, featured = false }: WhitepaperCardProps) {
  const formattedDate = formatDate(whitepaper.publishedAt)

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        whileHover={{ x: 4, y: 4 }}
        whileTap={{ scale: 0.99 }}
        style={{ originX: 0 }}
      >
        <Link href={`/whitepapers/${whitepaper.slug}`} className="block group">
          <article className="flex flex-col md:flex-row border-4 border-border bg-secondary-background shadow-shadow hover:shadow-none transition-shadow overflow-hidden">
            {whitepaper.imageUrl && (
              <div className="relative md:w-1/2 w-full h-64 md:h-auto border-b-4 md:border-b-0 md:border-r-4 border-border flex-shrink-0 overflow-hidden">
                <Image
                  src={whitepaper.imageUrl}
                  alt={whitepaper.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            )}
            <div className="flex flex-col justify-between p-8 flex-1">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs font-heading font-bold uppercase tracking-widest text-main border-2 border-main px-2 py-0.5">
                    Featured
                  </span>
                  <span className="text-xs font-heading font-bold uppercase tracking-widest border-2 border-border px-2 py-0.5">
                    Research Paper
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold leading-tight mb-4 group-hover:text-main transition-colors">
                  {whitepaper.title}
                </h2>
                {whitepaper.description && (
                  <p className="text-base text-foreground/70 leading-relaxed">
                    {whitepaper.description}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 mt-6 pt-4 border-t-2 border-border/40">
                {formattedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-4" />
                    {formattedDate}
                  </span>
                )}
              </div>
            </div>
          </article>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ x: 4, y: 4 }}
      whileTap={{ scale: 0.99 }}
      className="h-full"
    >
      <Link href={`/whitepapers/${whitepaper.slug}`} className="block group h-full">
        <article className="h-full flex flex-col border-4 border-border bg-secondary-background shadow-shadow hover:shadow-none transition-shadow overflow-hidden">
          {whitepaper.imageUrl && (
            <div className="relative w-full h-48 border-b-4 border-border flex-shrink-0 overflow-hidden">
              <Image
                src={whitepaper.imageUrl}
                alt={whitepaper.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="flex flex-col flex-1 p-5">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs font-heading font-bold uppercase tracking-widest border-2 border-border px-2 py-0.5">
                Research Paper
              </span>
            </div>
            <h2 className="text-lg font-heading font-bold leading-tight mb-3 group-hover:text-main transition-colors">
              {whitepaper.title}
            </h2>
            {whitepaper.description && (
              <p className="text-sm text-foreground/70 leading-relaxed flex-1">
                {whitepaper.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60 mt-4 pt-4 border-t-2 border-border/40">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formattedDate}
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
