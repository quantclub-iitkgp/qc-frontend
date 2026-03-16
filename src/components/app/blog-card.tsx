"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User } from "lucide-react"
import { motion } from "framer-motion"

import { type Blog } from "@/data/blogs"
import { Badge } from "@/components/ui/badge"

interface BlogCardProps {
  blog: Blog
  featured?: boolean
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
  const slug = blog.slug.replace("/blogs/", "")
  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

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
        <Link href={`/blogs/${slug}`} className="block group">
          <article className="flex flex-col md:flex-row border-4 border-border bg-secondary-background shadow-shadow hover:shadow-none transition-shadow overflow-hidden">
            {blog.coverImage && (
              <div className="relative md:w-1/2 w-full h-64 md:h-auto border-b-4 md:border-b-0 md:border-r-4 border-border flex-shrink-0 overflow-hidden">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            )}
            <div className="flex flex-col justify-between p-8 flex-1">
              <div>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs font-heading font-bold uppercase tracking-widest text-main border-2 border-main px-2 py-0.5">
                      Featured
                    </span>
                    {blog.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="default" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-heading font-bold leading-tight mb-4 group-hover:text-main transition-colors">
                  {blog.title}
                </h2>
                {blog.description && (
                  <p className="text-base text-foreground/70 leading-relaxed">
                    {blog.description}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 mt-6 pt-4 border-t-2 border-border/40">
                {blog.author && (
                  <span className="flex items-center gap-1.5">
                    <User className="size-4" />
                    {blog.author}
                  </span>
                )}
                {formattedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-4" />
                    {formattedDate}
                  </span>
                )}
                {blog.readTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    {blog.readTime}
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
      <Link href={`/blogs/${slug}`} className="block group h-full">
        <article className="h-full flex flex-col border-4 border-border bg-secondary-background shadow-shadow hover:shadow-none transition-shadow overflow-hidden">
          {blog.coverImage && (
            <div className="relative w-full h-48 border-b-4 border-border flex-shrink-0 overflow-hidden">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="flex flex-col flex-1 p-5">
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {blog.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="default" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <h2 className="text-lg font-heading font-bold leading-tight mb-3 group-hover:text-main transition-colors">
              {blog.title}
            </h2>
            {blog.description && (
              <p className="text-sm text-foreground/70 leading-relaxed flex-1">
                {blog.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60 mt-4 pt-4 border-t-2 border-border/40">
              {blog.author && (
                <span className="flex items-center gap-1">
                  <User className="size-3" />
                  {blog.author}
                </span>
              )}
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formattedDate}
                </span>
              )}
              {blog.readTime && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {blog.readTime}
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
