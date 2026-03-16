"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface DataPoint {
  label: string
  [key: string]: string | number
}

interface BlogLineChartProps {
  data: DataPoint[]
  lines: { key: string; color?: string }[]
  height?: number
  title?: string
}

const DEFAULT_COLORS = [
  "var(--color-main)",
  "#e86c4a",
  "#6366f1",
  "#f59e0b",
  "#10b981",
]

export default function BlogLineChart({
  data,
  lines,
  height = 300,
  title,
}: BlogLineChartProps) {
  return (
    <div className="not-prose my-8 border-4 border-border bg-secondary-background shadow-shadow">
      {title && (
        <div className="border-b-4 border-border px-5 py-3">
          <p className="font-heading font-bold text-sm">{title}</p>
        </div>
      )}
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.2} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "var(--color-foreground)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--color-foreground)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (typeof v === "number" ? v.toFixed(1) : v)}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-secondary-background)",
                border: "2px solid var(--color-border)",
                borderRadius: 0,
                fontSize: 13,
              }}
            />
            {lines.map((line, i) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
