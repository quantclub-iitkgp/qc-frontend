/**
 * linkedin-share.ts
 *
 * Client-side utilities for the "Share on LinkedIn" feature.
 *
 * Flow:
 *   1. Capture the target DOM element as a PNG blob via html-to-image.
 *   2. Trigger a browser download of the PNG to the user's device.
 *   3. Copy the pre-written post text to the clipboard.
 *   4. Open LinkedIn's "Create Post" page in a new tab.
 *
 * Why not use the LinkedIn Share URL (/sharing/share-offsite/)?
 *   That URL only creates a "link preview" post — not a true image post.
 *   LinkedIn's API requires OAuth2 + w_member_social scope to upload images
 *   programmatically, which is impractical for an anonymous end-user flow.
 *   The download-then-attach UX is used by Canva, Resume.io, and similar tools.
 */

import { toBlob } from "html-to-image"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ShareResult {
  /** The filename that was downloaded */
  filename: string
  /** The pre-built post text that was copied to the clipboard */
  postText: string
}

// ---------------------------------------------------------------------------
// Core share function
// ---------------------------------------------------------------------------

/**
 * Captures `element` as a PNG, downloads it to the user's device, copies
 * `postText` to the clipboard, and returns metadata about what happened.
 *
 * @param element  - The DOM node to screenshot.
 * @param postText - The pre-written LinkedIn post text.
 */
export async function captureAndShare(
  element: HTMLElement,
  postText: string,
): Promise<ShareResult> {
  // ── 1. Capture ──────────────────────────────────────────────────────────
  const originalWidth = element.offsetWidth
  const originalHeight = element.offsetHeight

  const blob = await toBlob(element, {
    quality: 0.95,
    pixelRatio: 2,        // 2× for retina sharpness
    cacheBust: true,
    skipFonts: true,      // Avoid CORS font loading issues
    fontEmbedCSS: "",     // Stop scanning document stylesheets for font rules
    width: originalWidth + 48,
    height: originalHeight + 48,
    style: {
      padding: "24px",
      margin: "0",
      width: `${originalWidth + 48}px`,
      height: `${originalHeight + 48}px`,
      backgroundColor: "oklch(93.46% 0.0304 254.32)",
      boxSizing: "border-box",
    },
  })
  if (!blob) throw new Error("Screen capture produced an empty blob")

  // ── 2. Download the image ───────────────────────────────────────────────
  const filename = `summer-of-quant-progress.png`
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = objectUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  // Revoke after a short delay so the download has time to start
  setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000)

  // ── 3. Copy post text to clipboard ─────────────────────────────────────
  try {
    await navigator.clipboard.writeText(postText)
  } catch {
    // Clipboard may be blocked in some browsers — not fatal
  }

  return { filename, postText }
}

// ---------------------------------------------------------------------------
// LinkedIn "Create Post" opener
// ---------------------------------------------------------------------------

/**
 * Opens LinkedIn's Create Post page in a new tab.
 * The image has already been downloaded; the user just attaches it.
 */
export function openLinkedInCreatePost(): void {
  window.open(
    "https://www.linkedin.com/feed/?shareActive=true",
    "_blank",
    "noopener,noreferrer",
  )
}
