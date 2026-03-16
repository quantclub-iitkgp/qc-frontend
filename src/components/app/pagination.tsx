"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  prev?: {
    name: string
    path: string
  }
  next?: {
    name: string
    path: string
  }
}

export default function Pagination({ prev, next }: Props) {
  return (
    <div
      className={cn("flex w-full items-center", {
        "justify-between": prev && next,
        "justify-start": prev && !next,
        "justify-end": !prev && next,
      })}
    >
      {prev?.name && (
        <Link href={prev.path}>
          <motion.div
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button className="sm:px-5 px-3.5 py-2 h-[unset] sm:text-sm text-xs gap-2">
              <motion.span
                whileHover={{ x: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <ArrowLeft className="size-4" />
              </motion.span>
              {prev.name}
            </Button>
          </motion.div>
        </Link>
      )}

      {next?.name && (
        <Link href={next.path}>
          <motion.div
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button className="sm:px-5 px-3.5 py-2 h-[unset] sm:text-sm text-xs gap-2">
              {next.name}
              <motion.span
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <ArrowRight className="size-4" />
              </motion.span>
            </Button>
          </motion.div>
        </Link>
      )}
    </div>
  )
}
