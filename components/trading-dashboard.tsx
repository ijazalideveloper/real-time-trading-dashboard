"use client";

import { useState, useMemo } from "react";
import { TickerList } from "./ticker-list";
import { PriceChart } from "./price-chart";
import { MarketStats } from "./market-stats";
import { Header } from "./common/header/Header";
import { useStocks } from "@/hooks/useStocks";
import { useChartData } from "@/hooks/useChartData";
import { useWebSocketData } from "@/hooks/useWebSocketData";
import { PriceAlertPanel } from "./price-alert-panel";

export function TradingDashboard() {
  const [selectedTicker, setSelectedTicker] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<number>(30);
  
  const { tickers, prices, isLoading } = useStocks();
  const { chartData, isLoading: isChartLoading } = useChartData(selectedTicker, selectedDays);
  
  const symbols = useMemo(() => tickers.map(t => t.symbol), [tickers]);
  const { liveData, isConnected } = useWebSocketData(symbols);
  
  // Merge live data with initial prices
  const livePrices = useMemo(() => {
    const merged = { ...prices };
    Object.entries(liveData).forEach(([symbol, data]) => {
      if (merged[symbol]) {
        // Get the previous close price from the initial API data
        const previousClose = merged[symbol].price - merged[symbol].change;
        const newPrice = data.price;
        merged[symbol] = {
          ...merged[symbol],
          price: newPrice,
          change: newPrice - previousClose,
          changePercent: ((newPrice - previousClose) / previousClose) * 100,
          lastUpdate: data.timestamp
        };
      }
    });
    return merged;
  }, [prices, liveData]);
  
  // Set first ticker as selected when data loads
  if (!selectedTicker && tickers.length > 0) {
    setSelectedTicker(tickers[0].symbol);
  }

  const currentTicker = tickers.find((t) => t.symbol === selectedTicker);
  const currentPrice = livePrices[selectedTicker];
  console.log("currentPrice", currentPrice)
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
              prices={livePrices}
              selectedTicker={selectedTicker}
              onSelectTicker={(symbol) => {
                setSelectedTicker(symbol);
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
                onRangeChange={setSelectedDays}
                isChartLoading={isChartLoading}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <PriceAlertPanel
                selectedSymbol={selectedTicker}
                currentPrice={currentPrice?.price}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
