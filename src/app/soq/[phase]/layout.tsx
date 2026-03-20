import { notFound } from "next/navigation"
import { isFeatureEnabled } from "@/lib/featureFlags"
import { getAllPhasesWithTopics, checkEnrollment, getCurrentUser, getUserProgress } from "@/lib/soq-api"
import { SoQSidebar, MobileSidebarToggle } from "./_components/soq-sidebar"
import { SoQProgressProvider } from "../_components/soq-progress-provider"
import { ReadingProgressBar } from "../_components/reading-progress-bar"
import { SoQScrollToTop } from "../_components/soq-scroll-to-top"


export default async function PhaseLayout({ children }: { children: React.ReactNode }) {
  if (!isFeatureEnabled("soq-program")) notFound()

  const [phases, enrolled, user] = await Promise.all([
    getAllPhasesWithTopics(),
    checkEnrollment(),
    getCurrentUser(),
  ])
  const completedTopicIds = enrolled ? await getUserProgress() : []

  return (
    <SoQProgressProvider>
      <div className="flex h-[calc(100dvh-70px)] mt-[70px]">
        {/* Left sidebar — desktop only */}
        <aside aria-label="Course navigation" className="hidden lg:flex w-72 flex-col border-r-4 border-border overflow-y-auto shrink-0 bg-background">
          <SoQSidebar phases={phases} enrolled={enrolled} userEmail={user?.email} completedTopicIds={completedTopicIds} />
        </aside>

        {/* Mobile sidebar toggle */}
        <MobileSidebarToggle phases={phases} enrolled={enrolled} userEmail={user?.email} completedTopicIds={completedTopicIds} />

        {/* Right content area */}
        <main className="flex-1 overflow-y-auto bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
          <ReadingProgressBar />
          <SoQScrollToTop />
          {children}
        </main>
      </div>
    </SoQProgressProvider>
  )
}
