export interface PriceAlert {
  id: string
  symbol: string
  targetPrice: number
  condition: "above" | "below"
  createdAt: string // Changed to string for JSON serialization
  triggered: boolean
  triggeredAt?: string
}

export interface AlertNotification {
  alert: PriceAlert
  currentPrice: number
  message: string
}

const ALERTS_STORAGE_KEY = "trading-dashboard-alerts"

let isInitialized = false

function loadAlerts(): PriceAlert[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(ALERTS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error("Failed to load alerts from localStorage:", e)
  }
  return []
}

function saveAlerts(alertsToSave: PriceAlert[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alertsToSave))
  } catch (e) {
    console.error("Failed to save alerts to localStorage:", e)
  }
}

let alerts: PriceAlert[] = []
let alertListeners: ((notification: AlertNotification) => void)[] = []

export function initializeAlerts(): void {
  if (isInitialized) return
  isInitialized = true
  alerts = loadAlerts()
  console.log(
    `Loaded ${alerts.length} alerts from localStorage:`,
    alerts.map((a) => `${a.symbol} ${a.condition} $${a.targetPrice}`),
  )
}

// Generate unique ID
function generateId(): string {
  return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Create a new price alert
export function createAlert(symbol: string, targetPrice: number, condition: "above" | "below"): PriceAlert {
  const alert: PriceAlert = {
    id: generateId(),
    symbol,
    targetPrice,
    condition,
    createdAt: new Date().toISOString(), // Use ISO string for serialization
    triggered: false,
  }
  alerts.push(alert)
  saveAlerts(alerts) // Persist to localStorage
  console.log(`Created alert: ${symbol} ${condition} $${targetPrice}`)
  return alert
}

// Remove an alert
export function removeAlert(id: string): boolean {
  const index = alerts.findIndex((a) => a.id === id)
  if (index > -1) {
    alerts.splice(index, 1)
    saveAlerts(alerts) // Persist to localStorage
    return true
  }
  return false
}

// Get all alerts for a symbol
export function getAlertsForSymbol(symbol: string): PriceAlert[] {
  return alerts.filter((a) => a.symbol === symbol)
}

// Get all alerts
export function getAllAlerts(): PriceAlert[] {
  return [...alerts]
}

// Check price against alerts and trigger if conditions met
export function checkPriceAlerts(symbol: string, currentPrice: number): AlertNotification[] {
  const notifications: AlertNotification[] = []

  alerts.forEach((alert) => {
    if (alert.symbol !== symbol || alert.triggered) return

    let shouldTrigger = false

    if (alert.condition === "above" && currentPrice >= alert.targetPrice) {
      shouldTrigger = true
    } else if (alert.condition === "below" && currentPrice <= alert.targetPrice) {
      shouldTrigger = true
    }

    if (shouldTrigger) {
      console.log(
        `ALERT TRIGGERED: ${symbol} ${alert.condition} $${alert.targetPrice} (Current: $${currentPrice.toFixed(2)})`,
      )

      alert.triggered = true
      alert.triggeredAt = new Date().toISOString() // Use ISO string
      saveAlerts(alerts) // Persist triggered state

      const notification: AlertNotification = {
        alert,
        currentPrice,
        message: `${symbol} is now ${alert.condition === "above" ? "above" : "below"} $${alert.targetPrice.toFixed(2)} (Current: $${currentPrice.toFixed(2)})`,
      }

      notifications.push(notification)
      alertListeners.forEach((listener) => listener(notification))
    }
  })

  return notifications
}

// Subscribe to alert notifications
export function subscribeToAlerts(callback: (notification: AlertNotification) => void): () => void {
  alertListeners.push(callback)
  return () => {
    alertListeners = alertListeners.filter((l) => l !== callback)
  }
}

// Clear triggered alerts
export function clearTriggeredAlerts(): void {
  alerts = alerts.filter((a) => !a.triggered)
  saveAlerts(alerts) // Persist to localStorage
}

// Reset all alerts
export function resetAllAlerts(): void {
  alerts = []
  saveAlerts(alerts) // Persist to localStorage
}
