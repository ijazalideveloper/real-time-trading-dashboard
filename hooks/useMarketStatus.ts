"use client"

import { useState, useEffect } from "react"
import { getMarketStatus } from "@/lib/api"

export function useMarketStatus() {
  const [isMarketOpen, setIsMarketOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        setIsConnected(true)
        const response = await getMarketStatus()
        setIsMarketOpen(response.isOpen)
      } catch (error) {
        console.warn('Failed to fetch market status:', error)
        setIsConnected(false)
        setIsMarketOpen(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketStatus()
    
    // Check market status every 5 minutes
    const interval = setInterval(fetchMarketStatus, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const getStatus = () => {
    if (isLoading) return { text: "Loading...", color: "text-muted-foreground" }
    if (!isConnected) return { text: "Disconnected", color: "text-red-500" }
    if (!isMarketOpen) return { text: "Market Closed", color: "text-yellow-500" }
    return { text: "Live", color: "text-emerald-500" }
  }

  return {
    isMarketOpen,
    isConnected,
    isLoading,
    status: getStatus()
  }
}