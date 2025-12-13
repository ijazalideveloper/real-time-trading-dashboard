"use client";

import { useState } from "react";
import { TickerList } from "./ticker-list";
import { PriceChart } from "./price-chart";
import { MarketStats } from "./market-stats";
import { Header } from "./common/header/Header";
import { useStocks } from "@/hooks/useStocks";
import { useChartData } from "@/hooks/useChartData";

export function TradingDashboard() {
  const [selectedTicker, setSelectedTicker] = useState<string>("AAPL");
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  
  const { tickers, prices, isLoading } = useStocks();
  const { chartData } = useChartData(selectedAssetId);

  const currentTicker = tickers.find((t) => t.symbol === selectedTicker);
  const currentPrice = prices[selectedTicker];
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading market data...</p>
        </div>
      </div>
    );
  }
  
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
              onSelectTicker={(symbol) => {
                setSelectedTicker(symbol);
                setSelectedAssetId(symbol);
              }}
            />
          </aside>

          {/* Main Chart Area */}
          <div className="flex flex-col gap-6">
            <MarketStats ticker={currentTicker} priceData={currentPrice} />

            <div className="h-[500px] lg:h-[600px]">
              <PriceChart 
                ticker={currentTicker} 
                currentPrice={currentPrice}
                chartData={chartData}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
