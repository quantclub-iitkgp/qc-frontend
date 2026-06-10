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

import { useRef, useState, RefObject } from "react"
import { Linkedin, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { captureAndShare, openLinkedInShare } from "@/lib/linkedin-share"

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

type Status = "idle" | "loading" | "copied" | "error"

export function LinkedInShareButton({
  captureRef,
  userName,
  completedCount = 0,
  totalTopics = 0,
  className = "",
}: LinkedInShareButtonProps) {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string>("")

  // Build the pre-fed LinkedIn post text
  function buildPostText(): string {
    return (
      `Thrilled to announce that I’ve officially kicked off my journey with the Summer of Quant program by @Quant Club, IIT Kharagpur!\n\n` +
      `I’m diving deep into the fascinating world of quantitative finance, building a solid foundation in:\n\n` +
      `* Quantitative Finance Basics\n\n` +
      `* Machine Learning for Finance\n\n` +
      `* Strategic Modeling & Implementation\n\n` +
      `The experience so far has been incredibly rewarding, and I’m eager to apply these skills to solve complex market challenges.\n\n` +
      `#QuantClub #SummerofQuant #QuantFinance #QuantitativeAnalysis`
    )
  }

  async function handleClick() {
    if (!captureRef.current) {
      setErrorMsg("Nothing to capture — ref is not attached.")
      setStatus("error")
      return
    }
    setStatus("loading")
    setErrorMsg("")
    try {
      const postText = buildPostText()
      const { shareUrl } = await captureAndShare(captureRef.current, postText)

      // Copy post text to clipboard (LinkedIn no longer allows pre-filling via URL)
      try {
        await navigator.clipboard.writeText(postText)
      } catch {
        // clipboard API may be blocked in some browsers — not fatal
      }

      setStatus("copied")
      // Log the URL for testing in LinkedIn Post Inspector
      console.log("LinkedIn Share URL for Post Inspector:", shareUrl)
      // Open LinkedIn — text is in clipboard, user pastes it
      openLinkedInShare(shareUrl)
      // Reset to idle after 6 s
      setTimeout(() => setStatus("idle"), 6000)
    } catch (err) {
      console.error("[LinkedInShareButton]", err)
      setErrorMsg(err instanceof Error ? err.message : "Unknown error")
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const label: Record<Status, string> = {
    idle: "Share on LinkedIn",
    loading: "Preparing share…",
    copied: "Paste in LinkedIn!",
    error: "Failed — retry?",
  }

  const Icon = () => {
    if (status === "loading") return <Loader2 className="h-4 w-4 animate-spin text-[#0A66C2]" />
    if (status === "copied") return <CheckCircle className="h-4 w-4 text-green-600" />
    if (status === "error") return <AlertCircle className="h-4 w-4 text-red-600" />
    return <Linkedin className="h-4 w-4 text-[#0A66C2] fill-[#0A66C2]" />
  }

  const colorClass: Record<Status, string> = {
    idle: "bg-white text-black border-border hover:bg-neutral-50",
    loading: "bg-white text-black/70 border-border cursor-wait",
    copied: "bg-white text-green-600 border-green-600 hover:bg-green-50",
    error: "bg-white text-red-600 border-red-600 hover:bg-red-50",
  }

  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      <button
        onClick={handleClick}
        disabled={status === "loading"}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-heading font-bold
          rounded-base border-2 shadow-shadow
          hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none
          transition-all disabled:opacity-70 disabled:pointer-events-none
          ${colorClass[status]}`}
        aria-label="Share your Summer of Quant progress on LinkedIn"
      >
        <Icon />
        {label[status]}
      </button>
      {status === "copied" && (
        <p className="text-xs text-green-600 max-w-[260px] leading-snug font-heading">
          ✅ Post text copied! Paste it in LinkedIn (Ctrl+V / ⌘V)
        </p>
      )}
      {status === "error" && errorMsg && (
        <p className="text-xs text-red-500 max-w-[260px] leading-snug">{errorMsg}</p>
      )}
    </div>
  )
}
