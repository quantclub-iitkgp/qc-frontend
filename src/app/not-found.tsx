import { ArrowUpRight } from "lucide-react"

import Link from "next/link"
import QuantaLost from "@/components/mascot/quanta-lost"

export default function NotFound() {
  return (
    <div className="text-foreground max-h-[100dvh] h-[100dvh] portrait:max-h-[100dvh] portrait:h-[100dvh] w-full flex items-center justify-center bg-background prose-headings:font-heading prose-h1:md:text-5xl prose-h1:text-3xl bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
      <div className="flex flex-col items-center text-center max-w-(--breakpoint-xl) px-5">
        <QuantaLost size={160} className="mb-4 quanta-bob" />

        <h1 className="leading-normal">404 Not Found</h1>

        <p className="leading-snug font-base sm:mt-[30px] sm:mb-[40px] my-9 2xl:text-3xl xl:text-2xl lg:text-2xl w-full md:text-2xl sm:text-xl text-xl">
          Quanta searched everywhere — this page doesn&apos;t exist.
        </p>

        <Link
          className="flex items-center font-base gap-2.5 w-max text-main-foreground rounded-base border-2 border-border bg-main md:px-10 px-4 md:py-3 py-2 md:text-[22px] text-base shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
          href={"/"}
        >
          Return home
          <ArrowUpRight className="md:size-[30px] size-5" />
        </Link>
      </div>
    </div>
  )
}
