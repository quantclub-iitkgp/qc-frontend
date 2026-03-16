"use client"

import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import rehypeHighlight from "rehype-highlight"
import { useState } from "react"
import { Check, Copy } from "lucide-react"

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 flex items-center gap-1.5 border-2 border-border bg-secondary-background px-2 py-1 text-xs font-heading font-bold text-foreground/70 hover:text-foreground hover:bg-main hover:text-main-foreground transition-colors"
      aria-label="Copy code"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeSlug, rehypeKatex, rehypeHighlight]}
      components={{
        pre({ children, ...props }) {
          // Extract raw text from nested code element for copy button
          const codeEl = (children as any)?.props
          const raw: string = typeof codeEl?.children === "string"
            ? codeEl.children
            : Array.isArray(codeEl?.children)
              ? codeEl.children.map((c: any) => (typeof c === "string" ? c : c?.props?.children ?? "")).join("")
              : ""

          return (
            <div className="relative my-7 group">
              <pre
                {...props}
                className="rounded-none border-4 border-border shadow-shadow overflow-x-auto p-5 bg-[#0d1117] text-[#e6edf3] text-sm leading-relaxed"
              >
                {children}
              </pre>
              <CopyButton code={raw} />
            </div>
          )
        },
        code({ className, children, ...props }) {
          // Block code is handled by <pre> above; this handles inline code only
          const isBlock = className?.startsWith("language-")
          if (isBlock) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
          return (
            <code
              className="px-1.5 py-0.5 border-2 border-border bg-secondary-background text-foreground font-bold text-sm mx-0.5 break-normal"
              {...props}
            >
              {children}
            </code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
