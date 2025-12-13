"use client";

import { useState, useEffect } from 'react';
import { getCandles } from '@/lib/api';

export function useChartData(symbol: string, days: number = 30) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadChartData = async () => {
      if (!symbol) return;
      
      setChartData([]); // Clear old data immediately
      setIsLoading(true);
      try {
        console.log('Fetching chart data for:', symbol, 'days:', days);
        const response = await getCandles(symbol, days);
        console.log('Chart response:', response);
        
        if (response && response.s === 'ok' && response.t && response.c) {
          const formattedData = response.t.map((timestamp: number, index: number) => ({
            timestamp: timestamp * 1000,
            value: response.c[index]
          }));
          console.log('Formatted chart data:', formattedData);
          setChartData(formattedData);
        } else {
          console.warn('No chart data available for', symbol);
          setChartData([]);
        }
      } catch (error) {
        console.error('Failed to load chart data:', error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChartData();
  }, [symbol, days]);

  return { chartData, isLoading };
}