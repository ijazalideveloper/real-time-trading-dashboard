import type { Ticker, PriceData, HistoricalDataPoint } from "./types"

export const mockTickers: Ticker[] = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer" },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
  { symbol: "NVDA", name: "NVIDIA Corp.", sector: "Technology" },
  { symbol: "META", name: "Meta Platforms", sector: "Technology" },
  { symbol: "JPM", name: "JPMorgan Chase", sector: "Financial" },
]

export const mockPrices: Record<string, PriceData> = {
  AAPL: { price: 178.52, change: 2.34, changePercent: 1.33, volume: 52431000, lastUpdate: Date.now() },
  GOOGL: { price: 141.8, change: -1.25, changePercent: -0.87, volume: 21543000, lastUpdate: Date.now() },
  MSFT: { price: 378.91, change: 4.67, changePercent: 1.25, volume: 18234000, lastUpdate: Date.now() },
  AMZN: { price: 178.25, change: 3.12, changePercent: 1.78, volume: 34521000, lastUpdate: Date.now() },
  TSLA: { price: 248.5, change: -5.8, changePercent: -2.28, volume: 98765000, lastUpdate: Date.now() },
  NVDA: { price: 495.22, change: 12.45, changePercent: 2.58, volume: 45678000, lastUpdate: Date.now() },
  META: { price: 505.75, change: 8.9, changePercent: 1.79, volume: 15432000, lastUpdate: Date.now() },
  JPM: { price: 198.34, change: -0.45, changePercent: -0.23, volume: 8765000, lastUpdate: Date.now() },
}

// Generate mock historical data
export function generateMockHistory(symbol: string, days: number): HistoricalDataPoint[] {
  const basePrice = mockPrices[symbol]?.price || 150
  const history: HistoricalDataPoint[] = []
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate realistic price movement
    const volatility = 0.02
    const randomChange = (Math.random() - 0.5) * 2 * volatility
    const trendFactor = 1 + (days - i) * 0.001 // Slight upward trend
    const price = basePrice * trendFactor * (1 + randomChange * (i / days))

    history.push({
      timestamp: date.getTime(),
      date: date.toISOString().split("T")[0],
      open: price * 0.998,
      high: price * 1.015,
      low: price * 0.985,
      close: price,
      volume: Math.floor(Math.random() * 10000000) + 5000000,
    })
  }

  return history
}
