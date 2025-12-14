"use client";

import { useState, useEffect, useRef } from 'react';

const API_KEY = 'd4uoe21r01qnm7pn7vs0d4uoe21r01qnm7pn7vsg';
const WS_URL = `wss://ws.finnhub.io?token=${API_KEY}`;

interface WebSocketMessage {
  type: string;
  data: Array<{
    s: string; // symbol
    p: number; // price
    t: number; // timestamp
    v: number; // volume
  }>;
}

export function useWebSocketData(symbols: string[]) {
  const [liveData, setLiveData] = useState<Record<string, { price: number; timestamp: number }>>({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const subscribedSymbols = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (symbols.length === 0) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to Finnhub WebSocket');
      setIsConnected(true);
      
      // Subscribe to symbols
      symbols.forEach(symbol => {
        if (!subscribedSymbols.current.has(symbol)) {
          ws.send(JSON.stringify({ type: 'subscribe', symbol }));
          subscribedSymbols.current.add(symbol);
          console.log(`Subscribed to ${symbol}`);
        }
      });
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        if (message.type === 'trade' && message.data) {
          message.data.forEach(trade => {
            setLiveData(prev => ({
              ...prev,
              [trade.s]: {
                price: trade.p,
                timestamp: trade.t
              }
            }));
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    return () => {
      // Unsubscribe from symbols
      symbols.forEach(symbol => {
        if (subscribedSymbols.current.has(symbol)) {
          ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
          subscribedSymbols.current.delete(symbol);
        }
      });
      ws.close();
    };
  }, [symbols]);

  return { liveData, isConnected };
}