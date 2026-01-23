import { useState } from "react";
import { PlayersView, BalancesView, TransactionsView } from "./views";

type ViewType = "players" | "transactions" | "balances";

export function DashboardPage() {
  const [activeView, setActiveView] = useState<ViewType>("players");

  const renderView = () => {
    switch (activeView) {
      case "players":
        return <PlayersView />;
      case "transactions":
        return <TransactionsView />;
      case "balances":
        return <BalancesView />;
      default:
        return <PlayersView />;
    }
  };

  return (
    <div>
      <nav className="mb-6 flex gap-4 border-b border-primary-400">
        {(["players", "transactions", "balances"] as ViewType[]).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 capitalize ${
              activeView === view
                ? "border-b-2 border-primary-300 text-default"
                : "text-muted"
            }`}
          >
            {view}
          </button>
        ))}
      </nav>
      {renderView()}
    </div>
  );
}
