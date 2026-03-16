"use client"

import { Locate, Mail } from "lucide-react"
import { FaLinkedinIn, FaGithub, FaDiscord } from "react-icons/fa"
import { RiTwitterXLine } from "react-icons/ri"
import { motion } from "framer-motion"

import { staggerContainer, cardItem, slideInLeft } from "@/lib/motion"
import MaxWidthWrapperNavbar from "./MaxWidthWrapperNavbar"

const links = [
  {
    name: "info@quantclub.ai",
    logo: Mail,
  },
  {
    name: "IIT Kharagpur",
    logo: Locate,
  },
]

const footerLinks = [
  {
    title: "Resources",
    links: ["Market Data", "Research Papers", "Tutorials", "API Documentation"],
  },
  {
    title: "About Us",
    links: [
      "Our Mission",
      "Core Team",
      "Research Publications",
      "Academic Partners",
      "Industry Collaborations",
    ],
  },
  {
    title: "Learning Center",
    links: ["Webinars", "Workshops", "Model Library", "Code Repository"],
  },
  {
    title: "Connect",
    links: ["Community Forum", "Events Calendar", "Career Opportunities"],
  },
]

const links_social = [
  { name: "github", logo: FaGithub, href: "https://github.com/quantclub-iitkgp" },
  { name: "twitter", logo: RiTwitterXLine, href: "#" },
  { name: "linkedin", logo: FaLinkedinIn, href: "#" },
  { name: "discord", logo: FaDiscord, href: "#" },
]

const conditions = ["Privacy Policy", "Terms of Service", "Data Usage Policy"]

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <MaxWidthWrapperNavbar className="flex flex-col gap-3">
      <div className="border-4 border-border p-5 space-y-10 bg-secondary-background">
        <div className="flex items-start max-md:flex-col gap-5">
          {/* Logo + contact info */}
          <motion.div
            className="space-y-5 shrink-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={slideInLeft}
          >
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 flex items-center justify-center bg-main border-4 border-border shadow-shadow">
                <img
                  src="/quant_club_iit_kharagpur_logo.png"
                  alt="Quant Club Logo"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <p className="max-sm:text-xs font-bold font-heading">QUANT CLUB</p>
            </div>
            <p className="max-w-72 text-foreground/60 text-sm">
              Bridging the gap between financial theory and practical
              implementation through cutting-edge algorithms, machine learning,
              and quantitative analysis.
            </p>
            <div className="flex flex-col gap-3">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="border-4 border-border bg-main/20 p-1 shadow-shadow">
                    <link.logo size={16} />
                  </div>
                  <p className="text-sm">{link.name}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Footer link columns */}
          <motion.div
            className="grid md:grid-cols-2 grid-cols-1 xl:grid-cols-4 md:gap-16 gap-8 flex-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {footerLinks.map((section, index) => (
              <motion.div key={index} variants={cardItem} className="space-y-2">
                <h3 className="font-heading font-semibold text-base">{section.title}</h3>
                <ul className="space-y-1">
                  {section.links.map((link, linkIndex) => (
                    <li
                      key={linkIndex}
                      className="text-sm text-foreground/60 hover:text-main transition-colors cursor-pointer"
                    >
                      {link}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="border-t-4 border-border" />

        <div className="flex items-center justify-between max-md:flex-col gap-5">
          <div className="flex items-center gap-5 max-sm:flex-col max-sm:text-xs">
            {conditions.map((condition, index) => (
              <p
                key={index}
                className="text-sm text-foreground/60 hover:text-main transition-colors cursor-pointer"
              >
                {condition}
              </p>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {links_social.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="flex items-center justify-center size-9 border-4 border-border bg-secondary-background shadow-shadow"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <link.logo size={16} />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="border-t-4 border-border" />

        <p className="text-center text-foreground/60 pb-2 max-sm:text-xs text-sm">
          Copyright © {year} Quant Club IIT Kharagpur. All rights reserved.
        </p>
      </div>
    </MaxWidthWrapperNavbar>
  )
}
