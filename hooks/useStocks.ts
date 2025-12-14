"use client";

import { useState, useEffect } from 'react';
import { getPopularStocks } from '@/lib/api';
import { initializeAlerts, checkPriceAlerts } from '@/lib/price-alerts';
import type { Ticker, PriceData } from '@/lib/types';

export function useStocks() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize alerts on first load
    initializeAlerts();
    
    const loadData = async () => {
      try {
        const response = await getPopularStocks();
        console.log('API Response:', response);
        const tickerData: Ticker[] = response?.data?.map((stock: any) => ({
          change: stock.change,
          changePercent: stock.changePercent,
          id: stock.id,
          logo: stock.logo,
          name: stock.name,
          price: stock.price,
          sector: stock.sector || 'Technology',
          symbol: stock.symbol,
        })) || [];
        console.log('Ticker Data:', tickerData);
        const priceData: Record<string, PriceData> = {};
        response?.data?.forEach((stock: any) => {
          priceData[stock.symbol] = {
            price: stock.price,
            change: stock.change || 0,
            changePercent: stock.changePercent || 0,
            volume: 0,
            lastUpdate: Date.now()
          };
          
          // Check price alerts for each stock
          checkPriceAlerts(stock.symbol, stock.price);
        });
        
        setTickers(tickerData);
        setPrices(priceData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { tickers, prices, isLoading };
}