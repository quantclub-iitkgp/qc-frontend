"use client"

import { Download, ExternalLink } from "lucide-react"

export default function PDFViewer({ url }: { url: string }) {
  return (
    <div className="flex flex-col h-[calc(100dvh-70px)]">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-3 border-b-4 border-border bg-secondary-background px-5 py-2 flex-shrink-0">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border-2 border-border bg-background px-3 py-1.5 text-sm font-heading font-bold hover:bg-main hover:text-main-foreground transition-colors"
        >
          <ExternalLink className="size-4" />
          Open in Tab
        </a>
        <a
          href={url}
          download
          className="flex items-center gap-2 border-2 border-border bg-main text-main-foreground px-3 py-1.5 text-sm font-heading font-bold hover:opacity-90 transition-opacity"
        >
          <Download className="size-4" />
          Download
        </a>
      </div>

      {/* Native browser PDF viewer */}
      <iframe
        src={url}
        className="flex-1 w-full border-0"
        title="PDF Viewer"
      />
    </div>
  )
}
