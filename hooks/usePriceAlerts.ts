"use client"

import { useState, useEffect, useCallback } from "react"
import { createAlert, removeAlert, getAllAlerts, subscribeToAlerts, initializeAlerts, checkPriceAlerts, type PriceAlert } from "@/lib/price-alerts"

export function usePriceAlerts(selectedSymbol: string, currentPrice: number | undefined) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [targetPrice, setTargetPrice] = useState("")
  const [condition, setCondition] = useState<"above" | "below">("above")

  const refreshAlerts = useCallback(() => {
    setAlerts(getAllAlerts())
  }, [])

  useEffect(() => {
    initializeAlerts()
    const timeout = setTimeout(refreshAlerts, 100)

    const unsubscribe = subscribeToAlerts((notification) => {
      console.log('Alert notification received:', notification)
      refreshAlerts()
    })

    const interval = setInterval(refreshAlerts, 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
      unsubscribe()
    }
  }, [refreshAlerts])

  useEffect(() => {
    if (currentPrice) {
      setTargetPrice(currentPrice.toFixed(2))
    }
  }, [selectedSymbol, currentPrice])

  const handleCreateAlert = () => {
    const price = Number.parseFloat(targetPrice)
    if (isNaN(price) || price <= 0) return

    createAlert(selectedSymbol, price, condition)
    
    // Check immediately if alert should trigger
    if (currentPrice) {
      checkPriceAlerts(selectedSymbol, currentPrice)
    }
    
    refreshAlerts()
    setTargetPrice("")
  }

  const handleRemoveAlert = (id: string) => {
    removeAlert(id)
    refreshAlerts()
  }

  const symbolAlerts = alerts.filter((a) => a.symbol === selectedSymbol)
  const otherAlerts = alerts.filter((a) => a.symbol !== selectedSymbol)

  return {
    alerts,
    symbolAlerts,
    otherAlerts,
    targetPrice,
    setTargetPrice,
    condition,
    setCondition,
    handleCreateAlert,
    handleRemoveAlert
  }
}