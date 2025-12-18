import { NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = process.env.FINNHUB_BASE_URL;
const POPULAR_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM'];

export async function GET() {
  try {
    const stocksData = await Promise.all(
      POPULAR_SYMBOLS.map(async (symbol) => {
        const [quoteRes, profileRes] = await Promise.all([
          axios.get(`${BASE_URL}/quote`, { params: { symbol, token: API_KEY } }),
          axios.get(`${BASE_URL}/stock/profile2`, { params: { symbol, token: API_KEY } })
        ]);
        
        const quote = quoteRes.data;
        const profile = profileRes.data;
        
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
    
    return NextResponse.json({
      data: stocksData.filter(Boolean),
      total: stocksData.length,
      page: 1,
      limit: 10
    });
  } catch (error) {
    console.error('Failed to fetch stocks:', error);
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}