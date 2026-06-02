// Rendered instantly on every navigation into a phase/topic while the dynamic content
// streams in. Because this boundary is static, Next can prefetch it on link hover/viewport,
// so clicks feel instant (<100ms) instead of waiting on the server round-trip with no UI.
export default function PhaseLoading() {
  return (
    <div className="px-6 md:px-10 py-8 max-w-5xl mx-auto animate-pulse" aria-busy="true" aria-label="Loading content">
      {/* Breadcrumb + progress row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-10 rounded-base bg-foreground/10" />
          <div className="h-3 w-3 rounded-base bg-foreground/10" />
          <div className="h-3 w-24 rounded-base bg-foreground/10" />
        </div>
        <div className="h-3 w-12 rounded-base bg-foreground/10" />
      </div>

      {/* Title block */}
      <div className="mb-8 pb-6 border-b-2 border-border">
        <div className="h-9 w-3/4 rounded-base bg-foreground/15 mb-4" />
        <div className="h-4 w-full max-w-xl rounded-base bg-foreground/10" />
      </div>

      {/* Body lines */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, block) => (
          <div key={block} className="space-y-3">
            <div className="h-5 w-1/3 rounded-base bg-foreground/15" />
            <div className="h-3 w-full rounded-base bg-foreground/10" />
            <div className="h-3 w-full rounded-base bg-foreground/10" />
            <div className="h-3 w-11/12 rounded-base bg-foreground/10" />
            <div className="h-3 w-4/5 rounded-base bg-foreground/10" />
          </div>
        ))}
      </div>
    </div>
  )
}
