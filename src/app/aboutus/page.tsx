import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

import {
  PageDescription,
  PageHeader,
  PageHeading,
  PageWrapper,
} from "@/components/app/page"
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/app/fade-in"
import { getTeam, type TeamMember } from "@/lib/api"
import QuantaCelebrate from "@/components/mascot/quanta-celebrate"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className="border-4 border-border bg-secondary-background shadow-shadow overflow-hidden flex flex-col h-full">
      {/* Initials avatar */}
      <div className="w-full aspect-square bg-main flex items-center justify-center border-b-4 border-border">
        <span className="text-4xl font-heading font-bold text-main-foreground">
          {getInitials(member.name)}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-lg">{member.name}</h3>
        <p className="text-sm font-medium text-main mb-3">{member.role}</p>
        <p className="text-sm text-foreground/60 leading-relaxed flex-1">{member.bio}</p>
        <div className="flex gap-2 mt-4 pt-4 border-t-4 border-border">
          {member.github && (
            <Link
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center justify-center size-9 border-4 border-border bg-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
            >
              <Github className="h-4 w-4" />
            </Link>
          )}
          {member.twitter && (
            <Link
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="flex items-center justify-center size-9 border-4 border-border bg-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
            >
              <Twitter className="h-4 w-4" />
            </Link>
          )}
          {member.linkedin && (
            <Link
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center justify-center size-9 border-4 border-border bg-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function AboutUsPage() {
  const teamMembers = await getTeam()

  return (
    <PageWrapper>
      <PageHeader>
        <PageHeading>About Our Team</PageHeading>
        <PageDescription>
          Meet the quantitative experts behind our algorithmic trading and
          financial analysis technologies. Our team combines expertise in
          mathematics, computer science, and finance.
        </PageDescription>
      </PageHeader>

      {/* Mission section */}
      <div className="mb-12">
        <FadeIn>
          <h2 className="text-2xl font-heading font-bold mb-6">Our Mission</h2>
          <FadeInStagger className="grid gap-6 lg:grid-cols-2">
            <FadeInItem className="border-4 border-border bg-secondary-background shadow-shadow p-6">
              <h3 className="font-heading font-bold text-lg mb-3">Research &amp; Innovation</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                We strive to advance the field of quantitative finance by developing
                cutting-edge algorithms and methodologies that redefine how markets are
                analyzed. Our research team publishes in top journals and collaborates
                with leading academic institutions.
              </p>
            </FadeInItem>
            <FadeInItem className="border-4 border-border bg-secondary-background shadow-shadow p-6">
              <h3 className="font-heading font-bold text-lg mb-3">Education &amp; Knowledge Sharing</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                We believe in democratizing quantitative finance knowledge through
                open-source tools, workshops, and educational content that helps traders
                and researchers implement data-driven investment strategies.
              </p>
            </FadeInItem>
          </FadeInStagger>
        </FadeIn>
      </div>

      {/* Team section */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <QuantaCelebrate size={100} />
          <h2 className="text-2xl font-heading font-bold">Meet The Team</h2>
        </div>
      </FadeIn>
      {teamMembers.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 mb-16 border-4 border-border border-dashed text-foreground/50">
          <p className="font-heading font-bold text-lg">Team profiles coming soon!</p>
        </div>
      ) : (
        <FadeInStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {teamMembers.map((member) => (
            <FadeInItem key={member.id}>
              <TeamMemberCard member={member} />
            </FadeInItem>
          ))}
        </FadeInStagger>
      )}

    </PageWrapper>
  )
}
