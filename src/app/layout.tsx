import "@/styling/globals.css"

import type { Metadata } from "next"
import localFont from "next/font/local"

import Navbar from "@/components/app/navbar"
import ScrollToTop from "@/components/app/scroll-to-top"
import SetStylingPref from "@/components/app/set-styling-pref"
import { ThemeProvider } from "@/components/app/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const dmSans = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-standard-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-standard-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: {
    default: "Quant Club IIT Kharagpur",
    template: "%s | Quant Club IIT Kharagpur",
  },
  description:
    "Quant Club IIT Kharagpur — advancing quantitative finance through research, education, and open-source tools. Explore blogs, whitepapers, and events.",
  keywords: [
    "quantitative finance",
    "algorithmic trading",
    "IIT Kharagpur",
    "quant club",
    "portfolio theory",
    "financial research",
  ],
  authors: [{ name: "Quant Club IIT Kharagpur", url: "https://quantclub.ai" }],
  metadataBase: new URL("https://quantclub.ai"),
  openGraph: {
    type: "website",
    siteName: "Quant Club IIT Kharagpur",
    title: "Quant Club IIT Kharagpur",
    description:
      "Advancing quantitative finance through research, education, and open-source tools.",
    url: "https://quantclub.ai",
    images: [{ url: "/quant_club_iit_kharagpur_logo.jpg", width: 800, height: 800 }],
  },
  twitter: {
    card: "summary",
    title: "Quant Club IIT Kharagpur",
    description:
      "Advancing quantitative finance through research, education, and open-source tools.",
    images: ["/quant_club_iit_kharagpur_logo.jpg"],
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
