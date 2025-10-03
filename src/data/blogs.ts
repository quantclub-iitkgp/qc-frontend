export type Blog = {
  slug: string
  slugAsParams: string
  title: string
  description?: string
  date?: string
  coverImage?: string
  author?: string
  tags?: string[]
}

export const BLOGS: Blog[] = [
  {
    slug: "/blogs/intro-to-quant-finance",
    slugAsParams: "blogs/intro-to-quant-finance",
    title: "Intro to Quant Finance",
    description: "A beginner-friendly overview of quantitative finance and its core ideas.",
    date: "2025-09-01",
    coverImage: "/showcase-previews/projects.webp",
    author: "Quant Club IIT Kharagpur",
    tags: ["basics", "overview", "quant"],
  },
  {
    slug: "/blogs/mean-variance-optimization",
    slugAsParams: "blogs/mean-variance-optimization",
    title: "Mean-Variance Optimization Explained",
    description: "Understanding Markowitz portfolios with intuition and simple math.",
    date: "2025-08-22",
    coverImage: "/template-previews/portfolio.webp",
    author: "Team QC",
    tags: ["portfolio", "optimization"],
  },
  {
    slug: "/blogs/algorithmic-trading-basics",
    slugAsParams: "blogs/algorithmic-trading-basics",
    title: "Algorithmic Trading: The Basics",
    description: "Data pipelines, signal generation, backtesting, and execution 101.",
    date: "2025-07-15",
    coverImage: "/template-previews/blog.webp",
    author: "Research Wing",
    tags: ["trading", "algorithms", "backtesting"],
  },
  {
    slug: "/blogs/factor-investing-overview",
    slugAsParams: "blogs/factor-investing-overview",
    title: "What Is Factor Investing?",
    description: "A quick tour of value, momentum, quality, size, and low-vol.",
    date: "2025-06-10",
    coverImage: "/template-previews/bento.webp",
    author: "Quant Club",
    tags: ["factors", "equities"],
  },
  {
    slug: "/blogs/risk-management-fundamentals",
    slugAsParams: "blogs/risk-management-fundamentals",
    title: "Risk Management Fundamentals",
    description: "Volatility, drawdowns, position sizing, and risk-parity basics.",
    date: "2025-05-02",
    coverImage: "/showcase-previews/jukebox.webp",
    author: "Team QC",
    tags: ["risk", "portfolio"],
  },
]

export default BLOGS
