"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { PriceData, Ticker } from "@/lib/types"
import { Activity, BarChart2, DollarSign, Percent } from "lucide-react"

interface MarketStatsProps {
  ticker: Ticker | undefined
  priceData: PriceData | undefined
}

export function MarketStats({ ticker, priceData }: MarketStatsProps) {
  if (!ticker || !priceData) {
    return null
  }

  const stats = [
    {
      label: "Current Price",
      value: `$${priceData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
    },
    {
      label: "24h Change",
      value: `${priceData.changePercent >= 0 ? "+" : ""}${priceData.changePercent.toFixed(2)}%`,
      icon: Percent,
      color: priceData.changePercent >= 0 ? "text-emerald-500" : "text-red-500",
    },
    // {
    //   label: "Volume",
    //   value: priceData.volume.toLocaleString(),
    //   icon: BarChart2,
    // },
    {
      label: "Status",
      value: "Live",
      icon: Activity,
      color: "text-emerald-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <stat.icon className="w-4 h-4" />
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className={`text-lg font-semibold font-mono ${stat.color || "text-foreground"}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
