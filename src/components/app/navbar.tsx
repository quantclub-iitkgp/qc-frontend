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
  const program = useFeatureFlag("soq-program")

  if (!program) return null

  if (mobile) {
    return (
      <div className="px-4 pb-4">
        <Link
          href="/soq"
          className="flex items-center gap-2 px-4 py-3 font-heading border-4 border-border bg-main text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
        >
          <Sun className="size-4 shrink-0" />
          Summer of Quant
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
              className="fixed left-0 top-0 bottom-0 w-[min(18rem,85vw)] bg-secondary-background border-r-4 border-border z-50 overflow-y-auto"
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
      <div className="mx-auto flex w-full max-w-container text-foreground items-center justify-between">
        {/* Logo */}
        <div className="flex items-center xl:gap-10 gap-4">
          <Link
            className="text-base sm:text-[18px] px-2.5 sm:px-4 h-9 rounded-base flex bg-main text-main-foreground border-4 border-border items-center justify-center font-heading font-bold gap-1.5 sm:gap-2 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all shrink-0 whitespace-nowrap"
            href="/"
          >
            <Image
              src="/quant_club_iit_kharagpur_logo.jpg"
              alt="Quant Club"
              width={24}
              height={24}
              className="rounded-sm"
            />
            <span className="hidden sm:inline">Quant Club</span>
          </Link>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex flex-1 items-center justify-center text-base font-base gap-10 xl:gap-10">
          <NavLinks />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* SoQ button unhided */}
          <SoQButton />
          <Search />

          <ThemeSwitcher />
          <MobileMenu />
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
