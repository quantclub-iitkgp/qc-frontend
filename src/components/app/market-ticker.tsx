"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Marquee } from "@devnomic/marquee"

export type MarketQuote = {
  symbol: string
  name: string
  price: number
  change: number
  changePct: number
}

function TickerItem({ quote }: { quote: MarketQuote }) {
  const isPositive = quote.change >= 0
  const isUSD = quote.symbol === "USDINR=X"

  const formatPrice = (v: number) =>
    isUSD
      ? `₹${v.toFixed(2)}`
      : `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v)}`

  return (
    <div className="flex items-center gap-3 px-6 border-r-2 border-border/40">
      <div>
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-foreground/50 block leading-none mb-0.5">
          {quote.name}
        </span>
        <span className="font-heading font-bold text-base leading-none">
          {formatPrice(quote.price)}
        </span>
      </div>
      <span
        className={`flex items-center gap-0.5 text-xs font-heading font-bold px-1.5 py-0.5 border-2 border-border ${
          isPositive ? "bg-main text-main-foreground" : "bg-red-500 text-white"
        }`}
      >
        {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
        {isPositive ? "+" : ""}
        {quote.changePct.toFixed(2)}%
      </span>
    </div>
  )
}

export default function MarketTicker({ quotes }: { quotes: MarketQuote[] }) {
  if (quotes.length === 0) return null

  return (
    <div className="border-t-4 border-b-4 border-border bg-background py-2">
      <Marquee
        className="md:[&_.animate-marquee-left]:gap-0! [&_.animate-marquee-left]:gap-0!"
        direction="left"
        pauseOnHover
      >
        {[...quotes, ...quotes].map((q, i) => (
          <TickerItem key={`${q.symbol}-${i}`} quote={q} />
        ))}
      </Marquee>
    </div>
  )
}
