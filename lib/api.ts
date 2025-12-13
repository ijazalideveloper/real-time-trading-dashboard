import axios from 'axios';

const API_KEY = 'd4uoe21r01qnm7pn7vs0d4uoe21r01qnm7pn7vsg';
const BASE_URL = 'https://finnhub.io/api/v1';

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

export const getStockQuote = async (symbol: string) => {
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
};

export const getStockProfile = async (symbol: string) => {
  try {
    const response = await apiClient.get<StockProfile>('/stock/profile2', {
      params: { symbol, token: API_KEY }
    });
    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch profile for ${symbol}:`, error);
    return null;
  }
};

export const getCandles = async (symbol: string, resolution: string = 'D', days: number = 30) => {
  try {
    const to = Math.floor(Date.now() / 1000);
    const from = to - (days * 24 * 60 * 60);
    
    const response = await apiClient.get('/stock/candle', {
      params: { symbol, resolution, from, to, token: API_KEY }
    });
    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch candles for ${symbol}:`, error);
    return { s: 'no_data' };
  }
};

export const getPopularStocks = async () => {
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
};

export type { FinnhubQuote, StockProfile };