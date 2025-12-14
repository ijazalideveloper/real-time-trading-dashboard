import { ProtectedRoute } from "@/components/protected-route"
import { TradingDashboard } from "@/components/trading-dashboard"

export default function HomePage() {
  return (
    <ProtectedRoute>
      <TradingDashboard />
    </ProtectedRoute>
  )
}
