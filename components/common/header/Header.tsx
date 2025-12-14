import { UserMenu } from "@/components/user-menu";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">TradingView</h1>
              <p className="text-xs text-muted-foreground">
                Real-Time Market Data
              </p>
            </div>
          </div>
            <UserMenu />
        </div>
      </div>
    </header>
  );
}
