import type { Metadata } from "next"
import { Mail, MapPin, Github, MessageSquare } from "lucide-react"
import { FaLinkedinIn, FaDiscord } from "react-icons/fa"
import { RiTwitterXLine } from "react-icons/ri"
import Link from "next/link"

import { Footer } from "@/components/app/footer"
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/app/fade-in"
import QuantaWave from "@/components/mascot/quanta-wave"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Quant Club IIT Kharagpur — reach us via email, Discord, or social media.",
}

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "info@quantclub.ai",
    href: "mailto:info@quantclub.ai",
    description: "Drop us a line anytime.",
  },
  {
    icon: FaDiscord,
    label: "Discord",
    value: "Join our server",
    href: "#",
    description: "Chat with the community in real-time.",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "quantclub-iitkgp",
    href: "https://github.com/quantclub-iitkgp",
    description: "Browse our open-source projects.",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "IIT Kharagpur, West Bengal",
    href: null,
    description: "On campus, always building.",
  },
]

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/quantclub-iitkgp" },
  { icon: RiTwitterXLine, label: "Twitter / X", href: "#" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
  { icon: FaDiscord, label: "Discord", href: "#" },
]

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-background pt-[70px]">
      {/* Page header */}
      <header className="border-b-4 border-border bg-secondary-background bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:40px_40px]">
        <div className="mx-auto max-w-container px-5 py-16 md:py-20">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 border-4 border-border bg-main px-3 py-1.5 text-sm font-heading font-bold text-main-foreground shadow-shadow">
                    <MessageSquare className="size-4" />
                    Contact
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight mb-4">
                  Get in Touch
                </h1>
                <p className="text-lg text-foreground/70 max-w-xl">
                  Have a question, collaboration idea, or just want to talk quant?
                  We&apos;d love to hear from you.
                </p>
              </div>
              <QuantaWave size={100} className="hidden sm:block flex-shrink-0" />
            </div>
          </FadeIn>
        </div>
      </header>

      <main className="mx-auto max-w-container px-5 py-12 md:py-16">
        {/* Contact methods grid */}
        <FadeInStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {contactMethods.map((method) => {
            const Inner = (
              <div className="border-4 border-border bg-secondary-background shadow-shadow p-6 flex flex-col gap-4 h-full hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
                <div className="size-12 border-4 border-border bg-main flex items-center justify-center flex-shrink-0 shadow-shadow">
                  <method.icon className="size-5 text-main-foreground" />
                </div>
                <div>
                  <p className="text-xs font-heading font-bold uppercase tracking-widest text-foreground/50 mb-1">
                    {method.label}
                  </p>
                  <p className="font-heading font-bold text-base">{method.value}</p>
                  <p className="text-sm text-foreground/60 mt-1">{method.description}</p>
                </div>
              </div>
            )
            return (
              <FadeInItem key={method.label}>
                {method.href ? (
                  <Link
                    href={method.href}
                    target={method.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    {Inner}
                  </Link>
                ) : (
                  Inner
                )}
              </FadeInItem>
            )
          })}
        </FadeInStagger>

        {/* Divider */}
        <div className="border-t-4 border-border mb-12" />

        {/* Follow us + CTA */}
        <FadeIn>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Social links */}
            <div className="border-4 border-border bg-secondary-background shadow-shadow p-8">
              <h2 className="text-xl font-heading font-bold mb-2">Follow Us</h2>
              <p className="text-sm text-foreground/60 mb-6">
                Stay updated with our latest research, events, and community activity.
              </p>
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex items-center justify-center size-11 border-4 border-border bg-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                  >
                    <s.icon className="size-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Collaborate CTA */}
            <div className="border-4 border-border bg-main shadow-shadow p-8 text-main-foreground">
              <h2 className="text-xl font-heading font-bold mb-2">Want to Collaborate?</h2>
              <p className="text-sm mb-6 opacity-80">
                We&apos;re always open to research partnerships, guest blog contributions,
                workshop proposals, and industry collaborations.
              </p>
              <Link
                href="mailto:info@quantclub.ai"
                className="inline-flex items-center gap-2 border-4 border-main-foreground px-5 py-2.5 font-heading font-bold text-sm bg-main-foreground text-main shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
              >
                <Mail className="size-4" />
                Send us an email
              </Link>
            </div>
          </div>
        </FadeIn>
      </main>

      <Footer />
    </div>
  )
}
