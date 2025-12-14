"use client"

import { useEffect, useState } from "react"
import { subscribeToAlerts, type AlertNotification } from "@/lib/price-alerts"
import { Bell, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function AlertToast() {
  const [notifications, setNotifications] = useState<AlertNotification[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToAlerts((notification) => {
      setNotifications((prev) => [...prev, notification])

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.alert.id !== notification.alert.id))
      }, 5000)
    })

    return unsubscribe
  }, [])

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.alert.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.alert.id}
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg shadow-lg border",
            "bg-card border-emerald-500/30 animate-in slide-in-from-right",
          )}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground">Price Alert</p>
            <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
          </div>
          <button
            onClick={() => dismissNotification(notification.alert.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
