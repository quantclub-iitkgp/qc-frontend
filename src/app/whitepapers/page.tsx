import { Metadata } from "next"

import {
  PageDescription,
  PageHeader,
  PageHeading,
  PageWrapper,
} from "@/components/app/page"

import Link from "next/link"
import ImageCard from "@/components/ui/image-card"
import { WHITEPAPERS } from "@/data/whitepaper/paper"
export const metadata: Metadata = {
  title: "Styling",
  description: "Learn how to fully customize your neobrutalism layouts.",
}

export default function Page() {
  
  return (
    <PageWrapper>
      <PageHeader>
        <PageHeading>Whitepapers</PageHeading>



        <div className="mt-10">
          <div className="w-full grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {WHITEPAPERS.map((wp) => (
              <Link key={wp.id} href={`/docs/whitepapers/${wp.slug}`}>
                <ImageCard
                  className="w-full"
                  imageUrl={wp.imageUrl}
                  caption={wp.title}
                />
              </Link>
            ))}
          </div>
        </div>
      </PageHeader>
    </PageWrapper>
  )
}
