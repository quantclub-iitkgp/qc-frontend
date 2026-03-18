"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function ContentRenderer({ body }: { body: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-headings:border-b-2 prose-headings:border-border prose-headings:pb-2 prose-a:text-main prose-a:no-underline hover:prose-a:underline prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-blockquote:border-l-4 prose-blockquote:border-main prose-blockquote:not-italic prose-blockquote:text-foreground/70">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  )
}
