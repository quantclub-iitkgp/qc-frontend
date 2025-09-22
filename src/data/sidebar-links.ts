import { transformToSlug } from "@/lib/utils"

import { BLOGS } from "./blogs"
import { WHITEPAPERS } from "./whitepaper/paper"


const BLOGS_LINKS = BLOGS.map((component) => {
  return {
    href: `/docs/blogs/${transformToSlug(component.title)}`,
    text: component.title,
  }
})

const WHITEPAPERS_LINKS = WHITEPAPERS.map((component) => {
  return {
    href: `/docs/whitepapers/${transformToSlug(component.title)}`,
    text: component.title,
  }
})

const GETTING_STARTED_LINKS = [
  {
    href: "/docs",
    text: "Blogs",
  },
  {
    href: "/whitepapers",
    text: "Whitepapers",
  },
  {
    href: "/events",
    text: "Events",
  },
  {
    href: "/aboutus",
    text: "About Us",
  },
  {
    href: "/contactus",
    text: "Contact Us",
  },



]

const MAIN_SIDEBAR = [
  "Getting started",
 
  {
    href: "/docs",
    text: "Introduction",
  },
  {
    href: "/docs/installation",
    text: "All Blogs",
  },




  "BLOGS",
  ...BLOGS_LINKS,

  "WHITEPAPERS",
  ...WHITEPAPERS_LINKS,

]

export { MAIN_SIDEBAR, BLOGS_LINKS, GETTING_STARTED_LINKS ,WHITEPAPERS_LINKS}
