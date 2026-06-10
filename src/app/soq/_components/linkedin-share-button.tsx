"use client"

/**
 * LinkedInShareButton
 *
 * Drop this next to any element you want to screenshot.
 * Pass a `captureRef` pointing at the DOM node to capture.
 *
 * Usage:
 *   const captureRef = useRef<HTMLDivElement>(null)
 *   ...
 *   <div ref={captureRef}> ... leaderboard or progress section ... </div>
 *   <LinkedInShareButton captureRef={captureRef} userName="John" completedCount={7} totalTopics={20} />
 */

import { RefObject, useState } from "react"
import { Linkedin, Loader2, CheckCircle, AlertCircle, Download, X } from "lucide-react"
import { captureAndShare, openLinkedInCreatePost } from "@/lib/linkedin-share"
import { toast } from "sonner"

interface LinkedInShareButtonProps {
  /** Ref to the DOM element that should be screenshotted */
  captureRef: RefObject<HTMLElement | null>
  /** Used to personalise the pre-written post text */
  userName?: string | null
  completedCount?: number
  totalTopics?: number
  /** Extra CSS classes for the button wrapper */
  className?: string
}

type Status = "idle" | "loading" | "done" | "error"

export function LinkedInShareButton({
  captureRef,
  userName,
  completedCount = 0,
  totalTopics = 0,
  className = "",
}: LinkedInShareButtonProps) {
  const [status, setStatus] = useState<Status>("idle")
  const [showInstructions, setShowInstructions] = useState(false)

  // Build the pre-fed LinkedIn post text
  function buildPostText(): string {
    return (
      `Thrilled to announce that I've officially kicked off my journey with the Summer of Quant program by @Quant Club, IIT Kharagpur!\n\n` +
      `I'm diving deep into the fascinating world of quantitative finance, building a solid foundation in:\n\n` +
      `* Quantitative Finance Basics\n\n` +
      `* Machine Learning for Finance\n\n` +
      `* Strategic Modeling & Implementation\n\n` +
      `The experience so far has been incredibly rewarding, and I'm eager to apply these skills to solve complex market challenges.\n\n` +
      `#QuantClub #SummerofQuant #QuantFinance #QuantitativeAnalysis`
    )
  }

  async function handleClick() {
    if (!captureRef.current) {
      toast.error("Nothing to capture — ref is not attached.")
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
      return
    }
    setStatus("loading")
    try {
      const postText = buildPostText()
      await captureAndShare(captureRef.current, postText)

      setStatus("done")
      setShowInstructions(true)
      toast.success("Image downloaded & post text copied!")
      setTimeout(() => setStatus("idle"), 8000)
    } catch (err) {
      console.error("[LinkedInShareButton]", err)
      const msg = err instanceof Error ? err.message : "Unknown error"
      setStatus("error")
      toast.error(`Share failed: ${msg}`)
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const label: Record<Status, string> = {
    idle: "Share on LinkedIn",
    loading: "Capturing…",
    done: "Open LinkedIn",
    error: "Failed — retry?",
  }

  const mobileLabel: Record<Status, string> = {
    idle: "Share",
    loading: "…",
    done: "Open",
    error: "Retry?",
  }

  const Icon = () => {
    if (status === "loading") return <Loader2 className="h-4 w-4 animate-spin text-[#0A66C2]" />
    if (status === "done") return <CheckCircle className="h-4 w-4 text-green-600" />
    if (status === "error") return <AlertCircle className="h-4 w-4 text-red-600" />
    return <Linkedin className="h-4 w-4 text-[#0A66C2] fill-[#0A66C2]" />
  }

  const colorClass: Record<Status, string> = {
    idle: "bg-white text-black border-border hover:bg-neutral-50",
    loading: "bg-white text-black/70 border-border cursor-wait",
    done: "bg-white text-green-700 border-green-500 hover:bg-green-50",
    error: "bg-white text-red-600 border-red-600 hover:bg-red-50",
  }

  return (
    <div className={`flex flex-col items-end gap-1 ${className}`}>
      <button
        onClick={status === "done" ? openLinkedInCreatePost : handleClick}
        disabled={status === "loading"}
        title="Share your Summer of Quant progress on LinkedIn"
        className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-heading font-bold
          rounded-base border-2 shadow-shadow
          hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none
          transition-all disabled:opacity-70 disabled:pointer-events-none
          ${colorClass[status]}`}
        aria-label="Share your Summer of Quant progress on LinkedIn"
      >
        <Icon />
        <span className="sm:hidden">{mobileLabel[status]}</span>
        <span className="hidden sm:inline">{label[status]}</span>
      </button>

      {/* Step-by-step instructions modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-sm rounded-base border-4 border-border bg-background shadow-shadow p-6 font-body">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-3 right-3 p-1 rounded hover:bg-secondary-background transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow">
                <Linkedin className="h-5 w-5 text-main-foreground" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-base leading-tight">Post to LinkedIn</h2>
                <p className="text-xs text-foreground/60">3 quick steps</p>
              </div>
            </div>

            <ol className="space-y-3 text-sm mb-5">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border bg-main text-main-foreground text-xs font-bold font-heading">1</span>
                <div>
                  <p className="font-semibold leading-snug">Image downloaded ✓</p>
                  <p className="text-foreground/60 text-xs">Check your Downloads folder for <code className="font-mono bg-secondary-background px-1 rounded text-[11px]">summer-of-quant-progress.png</code></p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border bg-main text-main-foreground text-xs font-bold font-heading">2</span>
                <div>
                  <p className="font-semibold leading-snug">Post text copied ✓</p>
                  <p className="text-foreground/60 text-xs">It&apos;s already in your clipboard — just paste it.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border bg-main text-main-foreground text-xs font-bold font-heading">3</span>
                <div>
                  <p className="font-semibold leading-snug">Attach the image in LinkedIn</p>
                  <p className="text-foreground/60 text-xs">Click the photo icon in the post editor, select the downloaded PNG, paste the text, and post!</p>
                </div>
              </li>
            </ol>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  openLinkedInCreatePost()
                  setShowInstructions(false)
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-heading font-bold rounded-base border-2 border-border bg-main text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
              >
                <Linkedin className="h-4 w-4" />
                Open LinkedIn
              </button>
              <button
                onClick={() => setShowInstructions(false)}
                className="px-4 py-2 text-sm font-heading font-bold rounded-base border-2 border-border bg-background text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
