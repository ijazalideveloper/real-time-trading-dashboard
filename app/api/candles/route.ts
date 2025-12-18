import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = process.env.FINNHUB_BASE_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const days = parseInt(searchParams.get('days') || '30');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    // Get current quote first
    const quoteRes = await axios.get(`${BASE_URL}/quote`, {
      params: { symbol, token: API_KEY }
    });
    
    const quote = quoteRes.data;
    if (!quote) {
      return NextResponse.json({ s: 'no_data' });
    }

    // Generate mock historical data based on current price
    const timestamps = [];
    const closes = [];
    const currentPrice = quote.c;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      timestamps.push(Math.floor(date.getTime() / 1000));
      
      const variation = (Math.random() - 0.5) * 0.04;
      const price = currentPrice * (1 + variation * (i / days));
      closes.push(Number(price.toFixed(2)));
    }
    
    return NextResponse.json({
      s: 'ok',
      t: timestamps,
      c: closes,
      o: closes.map(c => c * 0.998),
      h: closes.map(c => c * 1.015),
      l: closes.map(c => c * 0.985),
      v: closes.map(() => Math.floor(Math.random() * 10000000) + 1000000)
    });
  } catch (error) {
    console.error('Failed to generate chart data:', error);
    return NextResponse.json({ s: 'no_data' });
  }
}