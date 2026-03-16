import "@/styling/code.css"
import "katex/dist/katex.min.css"

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"

import { docs } from "@docs"

import { BLOGS } from "@/data/blogs"
import { MDXContent, MDXTableOfContents } from "@/components/app/mdx-components"
import { TableOfContents } from "@/components/app/toc"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/app/footer"
import BlogLineChart from "@/components/app/blog-line-chart"

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: BlogPageProps): Promise<Metadata> {
  const { slug } = await props.params
  const blog = BLOGS.find((b) => b.slug === `/blogs/${slug}`)
  if (!blog) return {}
  return {
    title: blog.title,
    description: blog.description,
  }
}

export async function generateStaticParams() {
  return BLOGS.map((blog) => ({
    slug: blog.slug.replace("/blogs/", ""),
  }))
}

interface TOCItem {
  depth: number
  value: string
  id: string
}

function transformTableOfContents(items: any[]): TOCItem[] {
  const flattened: TOCItem[] = []
  items.forEach((item) => {
    flattened.push({ depth: item.depth, value: item.value, id: item.id })
    if (item.children) {
      flattened.push(...transformTableOfContents(item.children))
    }
  })
  return flattened
}

export default async function BlogArticlePage(props: BlogPageProps) {
  const { slug } = await props.params

  // Find blog metadata
  const blog = BLOGS.find((b) => b.slug === `/blogs/${slug}`)
  if (!blog) notFound()

  // Find MDX document from Velite
  const doc = docs.find((d) => d.slugAsParams === `blogs/${slug}`)
  if (!doc) notFound()

  const rawToc = MDXTableOfContents({ code: doc.body })
  const toc = transformTableOfContents(rawToc)
  const hasToc = toc.length >= 2

  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <div className="min-h-dvh bg-background pt-[70px]">
      {/* Shift content left on xl screens to leave room for right TOC */}
      <div className={hasToc ? "xl:mr-[280px]" : ""}>
        {/* Back link */}
        <div className="border-b-4 border-border bg-secondary-background">
          <div className="mx-auto max-w-[800px] px-5 py-3">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-sm font-base text-foreground/60 hover:text-main transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article header */}
        <header className="mx-auto max-w-[800px] px-5 pt-10 pb-8">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="default" className="text-xs uppercase tracking-wide">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight mb-5 text-foreground">
            {blog.title}
          </h1>

          {/* Description */}
          {blog.description && (
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-7 font-base">
              {blog.description}
            </p>
          )}

          {/* Author row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-7 border-b-4 border-border">
            <div className="flex items-center gap-3">
              {/* Avatar placeholder */}
              <div className="size-10 border-4 border-border bg-main flex items-center justify-center flex-shrink-0">
                <User className="size-5 text-main-foreground" />
              </div>
              <div>
                {blog.author && (
                  <p className="font-heading font-bold text-sm">{blog.author}</p>
                )}
                {formattedDate && (
                  <p className="text-xs text-foreground/50">{formattedDate}</p>
                )}
              </div>
            </div>
            {blog.readTime && (
              <span className="flex items-center gap-1.5 text-sm text-foreground/60 ml-auto">
                <Clock className="size-4" />
                {blog.readTime}
              </span>
            )}
          </div>
        </header>

        {/* Cover image */}
        {blog.coverImage && (
          <div className="mx-auto max-w-[800px] px-5 mb-10">
            <div className="relative w-full h-64 md:h-80 lg:h-96 border-4 border-border overflow-hidden shadow-shadow">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Article body */}
        <article
          className="
            mx-auto max-w-[800px] px-5 pb-16
            prose-headings:font-heading prose-headings:scroll-mt-28
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-2 prose-h2:border-b-2 prose-h2:border-border/30
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-3
            prose-p:text-base prose-p:leading-8 prose-p:mt-5 prose-p:text-foreground prose-p:font-base
            prose-strong:font-heading prose-strong:font-bold
            prose-ul:mt-4 prose-ul:pl-6 prose-ul:list-disc
            prose-ol:mt-4 prose-ol:pl-6 prose-ol:list-decimal
            prose-li:mt-2 prose-li:text-base prose-li:leading-7 prose-li:text-foreground prose-li:font-base
            prose-blockquote:border-l-4 prose-blockquote:border-main prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-foreground/70 prose-blockquote:mt-6 prose-blockquote:mb-6 prose-blockquote:not-italic
            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none prose-code:border-2 prose-code:border-border prose-code:bg-main prose-code:text-main-foreground prose-code:font-bold prose-code:text-sm prose-code:mx-0.5 prose-code:break-normal
            prose-pre:rounded-none prose-pre:border-4 prose-pre:border-border prose-pre:shadow-shadow prose-pre:my-7
            prose-table:border-collapse prose-table:w-full prose-table:my-6
            prose-th:border-4 prose-th:border-border prose-th:bg-main prose-th:text-main-foreground prose-th:px-4 prose-th:py-2 prose-th:font-heading prose-th:text-left
            prose-td:border-2 prose-td:border-border/50 prose-td:px-4 prose-td:py-2 prose-td:text-sm
            prose-tr:even:bg-secondary-background
            prose-hr:border-2 prose-hr:border-border prose-hr:my-10
            prose-img:border-4 prose-img:border-border prose-img:shadow-shadow
            prose-a:text-main prose-a:underline prose-a:font-heading prose-a:decoration-main/50 hover:prose-a:decoration-main
          "
        >
          <MDXContent code={doc.body} components={{ BlogLineChart }} />
        </article>

        {/* Footer */}
        <Footer />
      </div>

      {/* Fixed right Table of Contents */}
      {hasToc && (
        <aside className="fixed bg-secondary-background border-l-4 border-border overflow-hidden top-[70px] xl:flex hidden flex-col right-0 w-[280px] h-[calc(100svh-70px)] overflow-y-auto">
          <TableOfContents items={toc} />
        </aside>
      )}
    </div>
  )
}
