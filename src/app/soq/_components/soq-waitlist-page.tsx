import { BookOpen, Users, Award, Clock, CalendarDays } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WaitlistForm } from "./waitlist-form"
import { WaitlistBackground } from "./waitlist-background"

const features = [
  {
    icon: Clock,
    title: "12 Weeks",
    description: "Structured, phase-wise curriculum from fundamentals to advanced ML strategies.",
  },
  {
    icon: BookOpen,
    title: "4 Phases",
    description: "Foundations → Markets → Trading Strategies → Risk & Machine Learning.",
  },
  {
    icon: Users,
    title: "Live Sessions",
    description: "Weekly live sessions with Quant Club members and industry practitioners.",
  },
  {
    icon: Award,
    title: "Certificate",
    description: "Earn a certificate from Quant Club IIT Kharagpur upon completion.",
  },
]

const timeline = [
  { date: "June 2026",       label: "Applications open" },
  { date: "Late June 2026",  label: "Program kickoff" },
  { date: "July – Aug 2026", label: "Phase sessions" },
  { date: "August 2026",     label: "Final project & certificates" },
]

export function SoQWaitlistPage() {
  return (
    <div className="pt-[70px] pb-16 bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-dvh">
      <div className="container max-w-6xl mx-auto relative px-5 py-12">
        <WaitlistBackground />

        {/* Hero */}
        <div
          className="text-center mb-16 relative z-10 animate-soq-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-main text-main-foreground border-2 border-border shadow-shadow text-sm font-heading rounded-base animate-soq-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Applications Opening Soon · Summer 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-none">
            Summer of{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Quant</span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-main/30 -z-0 rounded-sm" />
            </span>
          </h1>

          <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            A 12-week intensive program by{" "}
            <span className="font-heading text-foreground">Quant Club IIT Kharagpur</span>{" "}
            covering quantitative finance, systematic trading, and machine learning for markets.
          </p>
        </div>

        {/* Two-column: features + form */}
        <div className="grid lg:grid-cols-5 gap-8 relative z-10 mb-16">
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4 content-start">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="animate-soq-fade-up"
                style={{ animationDelay: `${200 + i * 80}ms` }}
              >
                <Card className="border-4 border-border shadow-shadow h-full transition-transform hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
                  <CardContent className="pt-6">
                    <div className="flex h-10 w-10 items-center justify-center border-4 border-border bg-main shadow-shadow mb-4 rounded-base">
                      <f.icon className="h-5 w-5 text-main-foreground" />
                    </div>
                    <h3 className="font-heading text-lg mb-1">{f.title}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">{f.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div
            className="lg:col-span-2 animate-soq-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <Card className="border-4 border-border shadow-shadow sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Reserve Your Spot</CardTitle>
                <CardDescription className="text-foreground/60">
                  Be first to know when applications open. No spam — just the signal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WaitlistForm />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative z-10 animate-soq-fade-up" style={{ animationDelay: "500ms" }}>
          <Card className="border-4 border-border shadow-shadow">
            <CardHeader className="text-center">
              <CardTitle className="font-heading">Program Timeline</CardTitle>
              <CardDescription className="text-foreground/60">What to expect, and when</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-4 gap-0">
                {timeline.map((item, i) => (
                  <div
                    key={item.label}
                    className="relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-2 p-4 sm:text-center"
                  >
                    {i < timeline.length - 1 && (
                      <div className="hidden sm:block absolute right-0 top-[2.1rem] w-1/2 h-0.5 bg-border" />
                    )}
                    {i > 0 && (
                      <div className="hidden sm:block absolute left-0 top-[2.1rem] w-1/2 h-0.5 bg-border" />
                    )}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-base border-4 border-border bg-main shadow-shadow">
                      <span className="text-xs font-heading text-main-foreground">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/50 font-base">{item.date}</p>
                      <p className="font-heading text-sm mt-0.5">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
