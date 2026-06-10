/**
 * linkedin-share.ts
 *
 * Client-side utilities for the "Share on LinkedIn" feature.
 * Flow:
 *   1. Capture a DOM element as a PNG blob via html-to-image.
 *   2. Upload the blob to the public `temp-shares` Supabase Storage bucket.
 *   3. Insert a row in `linkedin_shares` with the public URL + pre-fed post text.
 *   4. Return the edge-function share URL that embeds OG tags for LinkedIn.
 */

import { toBlob } from "html-to-image"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ShareResult {
  shareUrl: string   // the edge-function URL (for OG image crawling)
  postText: string   // pre-built post text to pass directly to LinkedIn
}

// ---------------------------------------------------------------------------
// Core share function
// ---------------------------------------------------------------------------

/**
 * Captures `element`, uploads the image, saves a DB record via server actions,
 * then returns the edge-function URL to hand off to the LinkedIn share dialog.
 *
 * @param element  - The DOM node to screenshot (e.g. a ref'd div).
 * @param postText - The pre-written LinkedIn post text to store.
 */
export async function captureAndShare(
  element: HTMLElement,
  postText: string,
): Promise<ShareResult> {
  // ── 1. Capture ──────────────────────────────────────────────────────────
  const originalWidth = element.offsetWidth
  const originalHeight = element.offsetHeight

  const blob = await toBlob(element, {
    quality: 0.92,
    pixelRatio: 2,        // 2× for retina sharpness
    cacheBust: true,
    skipFonts: true,      // Avoid CORS font loading issues
    fontEmbedCSS: "",     // Stop scanning document stylesheets for font rules (bypasses CORS errors)
    width: originalWidth + 48,
    height: originalHeight + 48,
    style: {
      padding: "24px",
      margin: "0",
      width: `${originalWidth + 48}px`,
      height: `${originalHeight + 48}px`,
      backgroundColor: "oklch(93.46% 0.0304 254.32)",
      boxSizing: "border-box",
    }
  })
  if (!blob) throw new Error("Screen capture produced an empty blob")

  // Convert blob to File and append to FormData for Server Action transport
  const file = new File([blob], "share.png", { type: "image/png" })
  const formData = new FormData()
  formData.append("file", file)

  // ── 2. Run Server Action ────────────────────────────────────────────────
  const { shareOnLinkedInAction } = await import("@/app/soq/actions")
  const result = await shareOnLinkedInAction(formData, postText)

  if ("error" in result) {
    throw new Error(result.error)
  }

  return { shareUrl: result.shareUrl, postText }
}

// ---------------------------------------------------------------------------
// LinkedIn window opener
// ---------------------------------------------------------------------------

/**
 * Opens the LinkedIn share dialog with the Edge Function URL.
 * Post text is pre-copied to clipboard by the caller — user just pastes.
 */
export function openLinkedInShare(shareUrl: string): void {
  const encoded = encodeURIComponent(shareUrl)
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`
  window.open(liUrl, "_blank", "width=600,height=600,noopener,noreferrer")
}
