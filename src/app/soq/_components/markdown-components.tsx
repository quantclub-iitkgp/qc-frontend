import type { Components } from "react-markdown"

/** Extracts an 11-char YouTube video ID from the common URL forms, or null. */
export function getYouTubeId(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^www\./, "")
  let id: string | null = null
  if (host === "youtu.be") {
    id = parsed.pathname.slice(1).split("/")[0] || null
  } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") id = parsed.searchParams.get("v")
    else if (parsed.pathname.startsWith("/embed/")) id = parsed.pathname.split("/")[2] ?? null
    else if (parsed.pathname.startsWith("/shorts/")) id = parsed.pathname.split("/")[2] ?? null
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null
}

/**
 * react-markdown component overrides shared by the public renderer and the admin
 * preview. A link to a YouTube video renders as an embedded responsive 16:9
 * player; every other link opens in a new tab.
 */
export const markdownComponents: Components = {
  a({ href, children }) {
    const videoId = href ? getYouTubeId(href) : null
    if (videoId) {
      return (
        <span className="my-4 block aspect-video w-full overflow-hidden rounded-base border-2 border-border shadow-shadow">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title="YouTube video player"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </span>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
}
