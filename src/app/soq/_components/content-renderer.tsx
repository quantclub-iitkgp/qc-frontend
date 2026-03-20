"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function ContentRenderer({ body }: { body: string }) {
  return (
    <div className={[
      "prose prose-neutral dark:prose-invert max-w-none",
      // Headings
      "prose-headings:font-heading prose-headings:tracking-tight",
      "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
      "prose-h2:border-b-2 prose-h2:border-border prose-h2:pb-2",
      // Links
      "prose-a:text-main prose-a:font-medium prose-a:no-underline prose-a:underline-offset-2 hover:prose-a:underline",
      // Inline code
      "prose-code:bg-secondary-background prose-code:border prose-code:border-border prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
      // Code blocks
      "prose-pre:bg-secondary-background prose-pre:border-2 prose-pre:border-border prose-pre:shadow-shadow prose-pre:rounded-base prose-pre:overflow-x-auto",
      "prose-pre:prose-code:bg-transparent prose-pre:prose-code:border-0 prose-pre:prose-code:p-0 prose-pre:prose-code:shadow-none",
      // Blockquote
      "prose-blockquote:border-l-4 prose-blockquote:border-main prose-blockquote:not-italic prose-blockquote:text-foreground/70 prose-blockquote:bg-main/5 prose-blockquote:py-1 prose-blockquote:rounded-r-base",
      // Tables
      "prose-table:border-2 prose-table:border-border prose-table:rounded-base prose-table:overflow-hidden",
      "prose-thead:bg-secondary-background prose-thead:border-b-2 prose-thead:border-border",
      "prose-th:px-3 prose-th:py-2 prose-th:font-heading prose-th:text-sm prose-th:border-r-2 prose-th:border-border",
      "prose-td:px-3 prose-td:py-2 prose-td:text-sm prose-td:border-r-2 prose-td:border-border",
      "prose-tr:border-b prose-tr:border-border",
      // HR
      "prose-hr:border-2 prose-hr:border-border",
      // Images
      "prose-img:rounded-base prose-img:border-2 prose-img:border-border prose-img:shadow-shadow",
      // Strong
      "prose-strong:font-heading",
    ].join(" ")}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  )
}
