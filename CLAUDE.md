# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

Official website for **Quant Club IIT Kharagpur** — a platform for quantitative finance education featuring blogs, whitepapers, event showcases, and interactive charts. The design follows a **neobrutalism aesthetic**: bold 4px borders, geometric grid backgrounds, and high-contrast colors.

## Commands

```bash
pnpm dev            # Start development server
pnpm build          # Production build
pnpm start          # Start production server
pnpm lint           # Run Next.js linter
pnpm format:write   # Format with Prettier
pnpm format:check   # Check formatting
```

**Package manager:** pnpm 9.6.0 — use `pnpm`, not `npm` or `yarn`.
**Node requirement:** >=20

### Content generation scripts (run when adding new components/content)

```bash
pnpm generate-stars-ts    # Regenerate star SVG components
pnpm generate-charts-ts   # Regenerate chart components
pnpm registry:generate    # Regenerate component registry JSON
pnpm registry:build       # Build shadcn components and registry styles
```

## Architecture

### Tech Stack

- **Next.js 15** with App Router (React 19, TypeScript 5)
- **Tailwind CSS v4** for styling
- **shadcn/ui** + **Radix UI** for accessible components
- **Velite** for type-safe MDX content (generates `.velite/` on build)
- **Framer Motion** for animations, **recharts** for charts
- **next-themes** for light/dark mode, **PostHog** for analytics

### Routing & Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Homepage with hero, features, events, charts, FAQ |
| `/docs/[[...slug]]` | `src/app/docs/[[...slug]]/page.tsx` | Blog articles |
| `/whitepapers/[[...slug]]` | `src/app/whitepapers/[[...slug]]/page.tsx` | Academic whitepapers |
| `/aboutus` | `src/app/aboutus/page.tsx` | About page |
| `/contactus` | `src/app/contactus/page.tsx` | Contact form |

There is a permanent redirect from `/components/*` → `/docs/*`.

### Content System

Content is managed via **Velite** + MDX files. On build, Velite generates type-safe exports in `.velite/` (aliased as `@docs`). Blog and whitepaper metadata is also stored statically in `src/data/blogs.ts` and `src/data/whitepaper/paper.ts`. Sidebar navigation is assembled in `src/data/sidebar-links.ts`.

To add a new blog post or whitepaper: add the MDX file, update the data file, and the sidebar links auto-derive from it.

### Component Organization

```
src/components/
├── app/        # Layout components: navbar, footer, sidebar, theme-provider, mdx-components
├── ui/         # shadcn/ui primitive components
├── stars/      # 40+ decorative star SVG components (s1–s40), auto-generated
└── examples/   # Example/demo implementations
```

### Path Aliases

- `@/*` → `src/*`
- `@public/*` → `public/*`
- `@docs` → `.velite` (generated content)

### Styling Conventions

- **Neobrutalism**: use `border-4 border-border` with `shadow-shadow` and translate-on-hover for interactive elements
- **Grid background**: CSS repeating linear gradients at 70px spacing (defined in globals.css)
- **CSS variables**: colors use custom properties (`--main`, `--border`, `--foreground`, etc.) supporting light/dark themes
- **Font**: DM Sans (loaded via `@next/font/google` in root layout)
- Global styles split across: `src/styling/globals.css`, `src/styling/code.css`, `src/styling/marquee.css`

### Key Patterns

- Server Components by default; add `"use client"` only when needed for interactivity/hooks
- `generateStaticParams()` used in docs and whitepapers routes for SSG
- MDX component overrides live in `src/components/app/mdx-components.tsx`
- Forms use React Hook Form + Zod validation
- The `StylingCustomizer` component allows dynamic theme color changes at runtime
