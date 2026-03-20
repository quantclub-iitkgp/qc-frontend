"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Sun } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import Search from "@/components/app/search"
import { ThemeSwitcher } from "@/components/app/theme-switcher"
import { cn } from "@/lib/utils"
import { useFeatureFlag } from "@/hooks/useFeatureFlag"

const navLinks = [
  { href: "/blogs", label: "Blogs" },
  { href: "/whitepapers", label: "WhitePaper" },
  { href: "/aboutus", label: "About Us" },
  { href: "/contactus", label: "Contact" },
]

function NavLinks({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname()

  if (mobile) {
    return (
      <nav className="flex flex-col gap-1 px-4 py-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "block px-4 py-3 font-base text-lg border-4 border-border transition-all",
                isActive
                  ? "bg-main text-main-foreground shadow-shadow"
                  : "bg-secondary-background hover:bg-main/10",
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <>
      {navLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          pathname.startsWith(link.href + "/")
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative font-base transition-colors hover:text-main",
              isActive ? "text-main font-bold" : "text-foreground",
            )}
          >
            {link.label}
            {isActive && (
              <motion.span
                layoutId="navUnderline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-main"
              />
            )}
          </Link>
        )
      })}
    </>
  )
}

function SoQButton({ mobile = false }: { mobile?: boolean }) {
  const waitlist = useFeatureFlag("soq-waitlist")
  const program = useFeatureFlag("soq-program")

  if (!waitlist && !program) return null

  if (mobile) {
    return (
      <div className="px-4 pb-4">
        <Link
          href="/soq"
          className="flex items-center gap-2 px-4 py-3 font-heading border-4 border-border bg-main text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
        >
          <Sun className="size-4 shrink-0" />
          Summer of Quant
          {waitlist && !program && (
            <span className="ml-auto text-xs bg-main-foreground/20 px-1.5 py-0.5 rounded-base">
              Waitlist
            </span>
          )}
        </Link>
      </div>
    )
  }

  return (
    <Link
      href="/soq"
      className="relative flex items-center gap-1.5 px-3 h-9 font-heading text-sm border-4 border-border bg-main text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all shrink-0"
    >
      <Sun className="size-3.5" />
      SoQ
      {waitlist && !program && (
        <span className="relative flex size-2 ml-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-main-foreground opacity-60" />
          <span className="relative inline-flex rounded-full size-2 bg-main-foreground" />
        </span>
      )}
    </Link>
  )
}

function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="lg:hidden flex items-center justify-center size-9 border-4 border-border bg-secondary-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-overlay z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-72 bg-secondary-background border-r-4 border-border z-50 overflow-y-auto"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 py-4 border-b-4 border-border">
                <span className="font-heading font-bold text-lg">Quant Club</span>
                <button
                  className="flex items-center justify-center size-9 border-4 border-border bg-background hover:bg-main/10 transition-colors"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-5" />
                </button>
              </div>

              <NavLinks mobile onClose={() => setOpen(false)} />
              <SoQButton mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function Navbar() {
  return (
    <motion.nav
      className="fixed left-0 top-0 z-20 mx-auto flex h-[70px] w-full items-center border-b-4 border-border bg-secondary-background px-5"
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mx-auto flex w-[1300px] text-foreground max-w-full items-center justify-between">
        {/* Logo */}
        <div className="flex items-center xl:gap-10 gap-4">
          <Link
            className="text-[18px] px-4 h-9 rounded-base flex bg-main text-main-foreground border-4 border-border items-center justify-center font-heading font-bold gap-2 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
            href="/"
          >
            <Image
              src="/quant_club_iit_kharagpur_logo.jpg"
              alt="Quant Club"
              width={24}
              height={24}
              className="rounded-sm"
            />
            Quant Club
          </Link>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex flex-1 items-center justify-center text-base font-base gap-10 xl:gap-10">
          <NavLinks />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <SoQButton />
          <Search />

          <a
            target="_blank"
            href="https://github.com/quantclub-iitkgp"
            aria-label="GitHub"
            className="flex gap-2 items-center justify-center border-4 border-border shadow-nav px-1.5 h-9 transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
          >
            <svg
              className="size-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
            >
              <path
                className="fill-foreground"
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
              />
            </svg>
          </a>

          <ThemeSwitcher />
          <MobileMenu />
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
