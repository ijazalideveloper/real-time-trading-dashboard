import axios from 'axios';
import { cache } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY!;
const BASE_URL = process.env.NEXT_PUBLIC_FINNHUB_BASE_URL!;

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

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});



const POPULAR_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM'];

export const getStockQuote = cache(async (symbol: string) => {
  try {
    const response = await apiClient.get<FinnhubQuote>('/quote', {
      params: { symbol, token: API_KEY }
    });
    console.log("getStockQuote", response.data);
    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch quote for ${symbol}:`, error);
    return null;
  }
});

export const getStockProfile = cache(async (symbol: string) => {
  try {
    const response = await apiClient.get<StockProfile>('/stock/profile2', {
      params: { symbol, token: API_KEY }
    });
    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch profile for ${symbol}:`, error);
    return null;
  }
});

export const getCandles = cache(async (symbol: string, days: number = 30) => {
  try {
    // Get current quote to generate realistic chart data
    const quote = await getStockQuote(symbol);
    if (!quote) return { s: 'no_data' };
    const timestamps = [];
    const closes = [];
    const currentPrice = quote.c;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      timestamps.push(Math.floor(date.getTime() / 1000));
      
      // Generate realistic price variation (±2% daily)
      const variation = (Math.random() - 0.5) * 0.04;
      const price = currentPrice * (1 + variation * (i / days));
      closes.push(Number(price.toFixed(2)));
    }
    
    return {
      s: 'ok',
      t: timestamps,
      c: closes,
      o: closes.map(c => c * 0.998),
      h: closes.map(c => c * 1.015),
      l: closes.map(c => c * 0.985),
      v: closes.map(() => Math.floor(Math.random() * 10000000) + 1000000)
    };
  } catch (error) {
    console.warn(`Failed to generate chart data for ${symbol}:`, error);
    return { s: 'no_data' };
  }
});

export const getMarketStatus = cache(async () => {
  try {
    const response = await apiClient.get('/stock/market-status', {
      params: {
        exchange: 'US',
        token: API_KEY
      }
    });
    return {
      isOpen: response.data.isOpen || false,
      exchange: response.data.exchange || 'US'
    };
  } catch (error) {
    console.warn('Failed to fetch market status:', error);
    return { isOpen: false, exchange: 'US' };
  }
});

export const getPopularStocks = cache(async () => {
  try {
    const stocksData = await Promise.all(
      POPULAR_SYMBOLS.map(async (symbol) => {
        const [quote, profile] = await Promise.all([
          getStockQuote(symbol),
          getStockProfile(symbol)
        ]);
        
        if (!quote || !profile) return null;
        
        return {
          id: symbol,
          symbol,
          name: profile.name || symbol,
          logo: profile.logo,
          price: quote.c,
          change: quote.d,
          changePercent: quote.dp,
          sector: 'Technology'
        };
      })
    );
    console.log("stocksData", stocksData);
    return {
      data: stocksData.filter(Boolean),
      total: stocksData.length,
      page: 1,
      limit: 10
    };
  } catch (error) {
    console.warn('Failed to fetch popular stocks:', error);
    return { data: [], total: 0, page: 1, limit: 10 };
  }
});

export type { FinnhubQuote, StockProfile };