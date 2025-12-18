import { cache } from 'react';

interface FinnhubQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

interface StockProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
}



export const getCandles = cache(async (symbol: string, days: number = 30) => {
  try {
    const response = await fetch(`/api/candles?symbol=${symbol}&days=${days}`);
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch chart data for ${symbol}:`, error);
    return { s: 'no_data' };
  }
});

export const getMarketStatus = cache(async () => {
  return { isOpen: true, exchange: 'US' };
});

export const getPopularStocks = cache(async () => {
  try {
    const response = await fetch('/api/stocks');
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch popular stocks:', error);
    return { data: [], total: 0, page: 1, limit: 10 };
  }
});

