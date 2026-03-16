"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type SensexDataPoint = {
  date: string
  close: number
}

const chartConfig = {
  close: {
    label: "Sensex",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const RANGES = [
  { label: "1 Month", value: "1m", days: 30 },
  { label: "3 Months", value: "3m", days: 90 },
  { label: "6 Months", value: "6m", days: 180 },
  { label: "1 Year", value: "1y", days: 365 },
]

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)
}

export default function SensexChart({ data }: { data: SensexDataPoint[] }) {
  const [range, setRange] = React.useState("1y")

  const selectedRange = RANGES.find((r) => r.value === range)!
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - selectedRange.days)

  const filtered = data.filter((d) => new Date(d.date) >= cutoff)

  const first = filtered[0]?.close ?? 0
  const last = filtered[filtered.length - 1]?.close ?? 0
  const change = last - first
  const changePct = first ? ((change / first) * 100).toFixed(2) : "0.00"
  const isPositive = change >= 0

  const minClose = Math.min(...filtered.map((d) => d.close))
  const maxClose = Math.max(...filtered.map((d) => d.close))
  const yPadding = (maxClose - minClose) * 0.05

  return (
    <Card className="bg-secondary-background text-foreground w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 space-y-0">
        <div className="flex-1">
          <CardTitle className="text-xl font-heading">
            BSE Sensex (^BSESN)
          </CardTitle>
          <CardDescription className="mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-2xl font-heading font-bold text-foreground">
              ₹{formatINR(last)}
            </span>
            <span
              className={`flex items-center gap-1 font-heading text-sm font-bold px-2 py-0.5 border-2 border-border ${
                isPositive
                  ? "bg-main text-main-foreground"
                  : "bg-red-500 text-white"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
              {isPositive ? "+" : ""}
              {changePct}% ({isPositive ? "+" : ""}
              {formatINR(change)})
            </span>
          </CardDescription>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[130px]" aria-label="Select time range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
          <AreaChart data={filtered} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="sensexGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={40}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              domain={[minClose - yPadding, maxClose + yPadding]}
              hide
            />
            <ReferenceLine y={first} stroke="var(--border)" strokeDasharray="4 4" />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  }
                  formatter={(value) => [
                    `₹${formatINR(Number(value))}`,
                    "Sensex",
                  ]}
                  indicator="line"
                />
              }
            />
            <Area
              dataKey="close"
              type="monotone"
              fill="url(#sensexGrad)"
              stroke={isPositive ? "var(--chart-1)" : "var(--chart-2)"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart-1)" }}
            />
          </AreaChart>
        </ChartContainer>
        <p className="text-xs text-foreground/40 text-right mt-2">
          Source: Yahoo Finance · Updated hourly
        </p>
      </CardContent>
    </Card>
  )
}
