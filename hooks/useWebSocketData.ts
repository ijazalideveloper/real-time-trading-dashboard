"use client";

import { useState, useEffect, useRef } from 'react';



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

    const url = `/api/websocket?symbols=${symbols.join(',')}`;
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log('Connected to WebSocket proxy');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
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
        console.error('Error parsing message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource Error:', error);
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [symbols]);

  return { liveData, isConnected };
}