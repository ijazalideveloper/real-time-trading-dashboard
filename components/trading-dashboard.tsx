"use client";

import { useEffect, useState, useCallback } from "react";
import { TickerList } from "./ticker-list";
import { PriceChart } from "./price-chart";
import { MarketStats } from "./market-stats";
import { mockTickers, mockPrices } from "@/lib/mock-data";
import { Header } from "./common/header/Header";
import type { Ticker, PriceData } from "@/lib/types";

export function TradingDashboard() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [selectedTicker, setSelectedTicker] = useState<string>("AAPL");

  // Fetch initial data
  useEffect(() => {
    setTickers(mockTickers);
    setPrices(mockPrices);
  }, []);

  // Real-time price updates via polling (simulates WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(mockPrices);
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const currentTicker = tickers.find((t) => t.symbol === selectedTicker);
  const currentPrice = prices[selectedTicker];
  console.log("tickers", tickers);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar - Ticker List */}
          <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] overflow-y-auto rounded-xl bg-card border border-border p-3">
            <TickerList
              tickers={tickers}
              prices={prices}
              selectedTicker={selectedTicker}
              onSelectTicker={setSelectedTicker}
            />
          </aside>

          {/* Main Chart Area */}
          <div className="flex flex-col gap-6">
            <MarketStats ticker={currentTicker} priceData={currentPrice} />

            <div className="h-[500px] lg:h-[600px]">
              <PriceChart ticker={currentTicker} currentPrice={currentPrice} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
