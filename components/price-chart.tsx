"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateMockHistory } from "@/lib/mock-data"
import type { PriceData, Ticker } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown, Clock, BarChart3 } from "lucide-react"

interface PriceChartProps {
  ticker: Ticker | undefined
  currentPrice: PriceData | undefined
}

const timeRanges = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
]

export function PriceChart({ ticker, currentPrice }: PriceChartProps) {
  const [selectedRange, setSelectedRange] = useState(30)

  const history = useMemo(() => {
    if (!ticker) return []
    return generateMockHistory(ticker.symbol, selectedRange)
  }, [ticker, selectedRange])

  if (!ticker) {
    return (
      <Card className="h-full flex items-center justify-center bg-card border-border">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a ticker to view chart</p>
        </div>
      </Card>
    )
  }

  const isPositive = currentPrice ? currentPrice.changePercent >= 0 : true
  const chartColor = isPositive ? "#10b981" : "#ef4444"

  return (
    <Card className="h-full flex flex-col bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">{ticker.symbol}</CardTitle>
            <p className="text-sm text-muted-foreground">{ticker.name}</p>
          </div>

          {currentPrice && (
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-foreground">
                $
                {currentPrice.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                className={cn(
                  "flex items-center justify-end gap-1 text-sm font-medium",
                  isPositive ? "text-emerald-500" : "text-red-500",
                )}
              >
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isPositive ? "+" : ""}${Math.abs(currentPrice.change).toFixed(2)} ({isPositive ? "+" : ""}
                {currentPrice.changePercent.toFixed(2)}%)
              </div>
              <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="w-3 h-3" />
                Live
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-1 mt-4">
          {timeRanges.map((range) => (
            <Button
              key={range.label}
              variant={selectedRange === range.days ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedRange(range.days)}
              className="text-xs px-3"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return selectedRange <= 7
                  ? date.toLocaleDateString(undefined, { weekday: "short" })
                  : date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
              }}
              minTickGap={30}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              width={80}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--popover-foreground))",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Area type="monotone" dataKey="close" stroke={chartColor} strokeWidth={2} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
