import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addSpaces(name: string) {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2")
}

export function transformToSlug(input: string): string {
  return input.toLowerCase().replace(/\s+/g, "-")
}

export function transformToName(input: string): string {
  return input
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function transformToPascalCase(input: string): string {
  return input
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}

export function formatDate(dateString: string | undefined | null): string | null {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
