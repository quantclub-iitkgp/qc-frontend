import { getSupabaseClient } from "@/lib/supabase"
import type { Blog } from "@/data/blogs"
import type { Whitepaper } from "@/data/whitepaper/paper"

export type { Blog, Whitepaper }

export type Event = {
  id: number
  title: string
  description: string
  date: string
  image: string
  link: string
}

export type TeamMember = {
  id: number
  name: string
  role: string
  image: string
  bio: string
  github: string | null
  linkedin: string | null
  twitter: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function blogFromRow(row: any): Blog {
  return {
    slug: row.slug,
    slugAsParams: row.slug_as_params,
    title: row.title,
    description: row.description ?? undefined,
    date: row.date ?? undefined,
    coverImage: row.cover_image ?? undefined,
    author: row.author ?? undefined,
    readTime: row.read_time ?? undefined,
    tags: row.tags ?? undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function whitepaperFromRow(row: any): Whitepaper {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    imageUrl: row.image_url,
    description: row.description ?? undefined,
    publishedAt: row.published_at,
    pdfUrl: row.pdf_url ?? undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function eventFromRow(row: any): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    image: row.image,
    link: row.link,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function teamFromRow(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    image: row.image,
    bio: row.bio,
    github: row.github ?? null,
    linkedin: row.linkedin ?? null,
    twitter: row.twitter ?? null,
  }
}

export async function getBlogs(): Promise<Blog[]> {
  const { data, error } = await getSupabaseClient()
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(blogFromRow)
}

export async function getWhitepapers(): Promise<Whitepaper[]> {
  const { data, error } = await getSupabaseClient()
    .from("whitepapers")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(whitepaperFromRow)
}

export async function getEvents(): Promise<Event[]> {
  const { data, error } = await getSupabaseClient()
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(eventFromRow)
}

export async function getTeam(): Promise<TeamMember[]> {
  const { data, error } = await getSupabaseClient()
    .from("team")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(teamFromRow)
}
