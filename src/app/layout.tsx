import "@/styling/globals.css"

import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"

import Navbar from "@/components/app/navbar"
import ScrollToTop from "@/components/app/scroll-to-top"
import SetStylingPref from "@/components/app/set-styling-pref"
import { ThemeProvider } from "@/components/app/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: {
    default:
      "Quant Club",
    template: "%s | Quant Club",
  },
  
  authors: [{ name: "Harsh Bhatt", url: "https://github.com/Harsh-BH" }],
  openGraph: {
    type: "website",
    description:
      "Official Website of Quant Club, IIT Kharagpur.",
  },
  icons: {
    icon: "/quant_club_iit_kharagpur_logo.jpg",
    apple: "/quant_club_iit_kharagpur_logo.jpg",
  },
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="scroll-smooth" suppressHydrationWarning lang="en">
      <body className={dmSans.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <SetStylingPref />
            <ScrollToTop />
            <Toaster />
          </ThemeProvider>
      </body>
    </html>
  )
}
