"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, BellOff, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePriceAlerts } from "@/hooks/usePriceAlerts"

interface PriceAlertPanelProps {
  selectedSymbol: string
  currentPrice: number | undefined
}

export function PriceAlertPanel({ selectedSymbol, currentPrice }: PriceAlertPanelProps) {
  const {
    alerts,
    symbolAlerts,
    otherAlerts,
    targetPrice,
    setTargetPrice,
    condition,
    setCondition,
    handleCreateAlert,
    handleRemoveAlert
  } = usePriceAlerts(selectedSymbol, currentPrice)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Price Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Alert Form */}
        <div className="space-y-3 p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>Alert me when</span>
            <span className="text-primary">{selectedSymbol}</span>
            <span>goes</span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={condition === "above" ? "default" : "outline"}
              onClick={() => setCondition("above")}
              className="flex-1"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Above
            </Button>
            <Button
              size="sm"
              variant={condition === "below" ? "default" : "outline"}
              onClick={() => setCondition("below")}
              className="flex-1"
            >
              <TrendingDown className="w-3 h-3 mr-1" />
              Below
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="targetPrice" className="sr-only">
                Target Price
              </Label>
              <Input
                id="targetPrice"
                type="number"
                step="0.01"
                placeholder="Target price"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="bg-background"
              />
            </div>
            <Button onClick={handleCreateAlert} disabled={!targetPrice}>
              Set Alert
            </Button>
          </div>

          {currentPrice && <p className="text-xs text-muted-foreground">Current price: ${currentPrice.toFixed(2)}</p>}
        </div>

        {/* Active Alerts */}
        {symbolAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">{selectedSymbol} Alerts</h4>
            {symbolAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md text-sm",
                  alert.triggered ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted/30",
                )}
              >
                <div className="flex items-center gap-2">
                  {alert.triggered ? (
                    <BellOff className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Bell className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span>
                    {alert.condition === "above" ? "Above" : "Below"} ${alert.targetPrice.toFixed(2)}
                  </span>
                  {alert.triggered && <span className="text-xs text-emerald-500">(Triggered)</span>}
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleRemoveAlert(alert.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Other Alerts */}
        {otherAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Other Alerts</h4>
            {otherAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md text-sm",
                  alert.triggered ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted/30",
                )}
              >
                <div className="flex items-center gap-2">
                  {alert.triggered ? (
                    <BellOff className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Bell className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span className="font-medium">{alert.symbol}</span>
                  <span>
                    {alert.condition === "above" ? ">" : "<"} ${alert.targetPrice.toFixed(2)}
                  </span>
                  {alert.triggered && <span className="text-xs text-emerald-500">(Triggered)</span>}
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleRemoveAlert(alert.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {alerts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">No alerts set. Create one above.</p>
        )}
      </CardContent>
    </Card>
  )
}
