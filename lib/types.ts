export interface Ticker {
  symbol: string
  name: string
  sector: string
}

export interface PriceData {
  price: number
  change: number
  changePercent: number
  volume: number
  lastUpdate: number
}

export interface HistoricalDataPoint {
  timestamp: number
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface HistoricalData {
  symbol: string
  history: HistoricalDataPoint[]
  meta: {
    period: string
    dataPoints: number
  }
}
