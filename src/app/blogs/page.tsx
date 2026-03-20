export const revalidate = 3600 // revalidate every hour

import type { Metadata } from "next"
import { ArrowUpRight, BookOpen } from "lucide-react"
import Link from "next/link"

import { getBlogs } from "@/lib/api"
import { BlogCard } from "@/components/app/blog-card"
import { Footer } from "@/components/app/footer"
import { AnimatedBlogHeader, AnimatedBlogBadge } from "@/components/app/blog-header-animations"
import { FadeIn } from "@/components/app/fade-in"
import QuantaRead from "@/components/mascot/quanta-read"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore articles on quantitative finance, algorithmic trading, portfolio theory, and risk management from Quant Club IIT Kharagpur.",
}

export default async function BlogsPage() {
  const blogs = await getBlogs()
  const [featuredBlog, ...restBlogs] = blogs

  return (
    <div className="min-h-dvh bg-background pt-[70px]">
      {/* Page header */}
      <header className="border-b-4 border-border bg-secondary-background bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:40px_40px]">
        <div className="mx-auto max-w-container px-5 py-16 md:py-20">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <AnimatedBlogBadge>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 border-4 border-border bg-main px-3 py-1.5 text-sm font-heading font-bold text-main-foreground shadow-shadow">
                    <BookOpen className="size-4" />
                    The Quant Blog
                  </span>
                </div>
              </AnimatedBlogBadge>
              <AnimatedBlogHeader>
                <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                  Ideas, Research &amp;
                  <br className="hidden sm:block" /> Market Insights
                </h1>
                <p className="mt-4 text-lg text-foreground/70 max-w-xl">
                  Deep dives into quantitative finance, portfolio theory, algorithmic
                  trading, and risk management by the researchers at Quant Club IIT
                  Kharagpur.
                </p>
              </AnimatedBlogHeader>
            </div>
            <div className="flex items-end gap-6">
              <QuantaRead size={85} className="hidden sm:block flex-shrink-0" />
              <Link
                href="/docs"
                className="flex items-center gap-2 border-4 border-border bg-main px-5 py-3 font-heading font-bold text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all self-end"
              >
                All Docs
                <ArrowUpRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-container px-5 py-12 md:py-16">
        {blogs.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-foreground/50">
            <BookOpen className="size-12 opacity-40" />
            <p className="font-heading font-bold text-xl">No articles yet — check back soon!</p>
            <p className="text-sm">The team is working on something great.</p>
          </div>
        )}

        {/* Featured blog */}
        {featuredBlog && (
          <section className="mb-12">
            <FadeIn>
              <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-foreground/50 mb-5 border-l-4 border-main pl-3">
                Latest Article
              </h2>
            </FadeIn>
            <BlogCard blog={featuredBlog} featured />
          </section>
        )}

        {/* Divider */}
        <div className="border-t-4 border-border mb-12" />

        {/* Grid of remaining blogs */}
        {restBlogs.length > 0 && (
          <section>
            <FadeIn>
              <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-foreground/50 mb-5 border-l-4 border-main pl-3">
                More Articles
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {restBlogs.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
