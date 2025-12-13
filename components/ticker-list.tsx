"use client"

import { cn } from "@/lib/utils"
import type { Ticker, PriceData } from "@/lib/types"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TickerListProps {
  tickers: Ticker[]
  prices: Record<string, PriceData>
  selectedTicker: string
  onSelectTicker: (symbol: string) => void
}

export function TickerList({ tickers, prices, selectedTicker, onSelectTicker }: TickerListProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Watchlist</div>
      {tickers.map((ticker) => {
        const priceData = prices[ticker.symbol]
        const isPositive = priceData?.changePercent >= 0
        const isSelected = selectedTicker === ticker.symbol

        return (
          <button
            key={ticker.symbol}
            onClick={() => onSelectTicker(ticker.symbol)}
            className={cn(
              "flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200",
              "hover:bg-accent/50",
              isSelected && "bg-accent",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold",
                  isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500",
                )}
              >
                {ticker.symbol.slice(0, 2)}
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">{ticker.symbol}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[120px]">{ticker.name}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-semibold text-foreground">
                $
                {priceData.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                className={cn(
                  "flex items-center justify-end gap-1 text-xs font-medium",
                  isPositive ? "text-emerald-500" : "text-red-500",
                )}
              >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? "+" : ""}
                {priceData.changePercent.toFixed(2)}%
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
