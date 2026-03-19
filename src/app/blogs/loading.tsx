export default function BlogsLoading() {
  return (
    <div className="min-h-dvh bg-background pt-[70px]">
      {/* Header skeleton */}
      <header className="border-b-4 border-border bg-secondary-background">
        <div className="mx-auto max-w-container px-5 py-16 md:py-20">
          <div className="h-6 w-36 bg-border animate-pulse mb-4" />
          <div className="h-10 w-80 bg-border animate-pulse mb-3" />
          <div className="h-5 w-96 bg-border animate-pulse" />
        </div>
      </header>

      <main className="mx-auto max-w-container px-5 py-12 md:py-16">
        {/* Featured skeleton */}
        <div className="h-4 w-28 bg-border animate-pulse mb-5" />
        <div className="border-4 border-border bg-secondary-background p-6 mb-12">
          <div className="h-56 bg-border animate-pulse mb-6" />
          <div className="h-7 w-3/4 bg-border animate-pulse mb-3" />
          <div className="h-4 w-full bg-border animate-pulse mb-2" />
          <div className="h-4 w-2/3 bg-border animate-pulse" />
        </div>

        <div className="border-t-4 border-border mb-12" />

        {/* Grid skeleton */}
        <div className="h-4 w-28 bg-border animate-pulse mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-4 border-border bg-secondary-background p-5">
              <div className="h-36 bg-border animate-pulse mb-4" />
              <div className="h-5 w-3/4 bg-border animate-pulse mb-2" />
              <div className="h-4 w-full bg-border animate-pulse mb-1" />
              <div className="h-4 w-2/3 bg-border animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
