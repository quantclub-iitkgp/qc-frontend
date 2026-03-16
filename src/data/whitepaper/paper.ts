
export type Whitepaper = {
  id: number
  title: string
  slug: string
  imageUrl: string
  publishedAt: string
  pdfUrl?: string
}

export const WHITEPAPERS: Whitepaper[] = [
  {
    id: 1,
    title: "Stochastic Volatility Models",
    slug: "stochastic-volatility-models",
    imageUrl: "/template-previews/blog.webp",
    publishedAt: "2025-03-01",
  },
  {
    id: 2,
    title: "Algorithmic Trading Strategies",
    slug: "algorithmic-trading-strategies",
    imageUrl: "/template-previews/portfolio.webp",
    publishedAt: "2025-02-15",
  },
  {
    id: 3,
    title: "Risk Parity and Portfolio Construction",
    slug: "risk-parity-and-portfolio-construction",
    imageUrl: "/template-previews/windowed-portfolio.webp",
    publishedAt: "2025-01-20",
  },
  {
    id: 4,
    title: "Market Microstructure and Liquidity",
    slug: "market-microstructure-and-liquidity",
    imageUrl: "/template-previews/bento.webp",
    publishedAt: "2024-12-10",
  },
  {
    id: 5,
    title: "Statistical Arbitrage Techniques",
    slug: "statistical-arbitrage-techniques",
    imageUrl: "/showcase-previews/projects.webp",
    publishedAt: "2024-11-05",
  },
  {
    id: 6,
    title: "Factor Investing in Practice",
    slug: "factor-investing-in-practice",
    imageUrl: "/showcase-previews/jukebox.webp",
    publishedAt: "2024-10-01",
  },
]