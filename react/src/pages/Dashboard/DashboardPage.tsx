import { useState } from "react";
import { PlayersView } from "./views/PlayersView/PlayersView.js";
import { BalancesView } from "./views/BalancesView/BalancesView.js";
import { TransactionsView } from "./views/TransactionsView/TransactionsView.js";

type ViewType = "players" | "transactions" | "balances";

const views: ReadonlyArray<{ key: ViewType; label: string }> = [
  { key: "players", label: "Players" },
  { key: "transactions", label: "Transactions" },
  { key: "balances", label: "Balances" },
];

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
      <nav
        aria-label="Dashboard sections"
        className="mb-6 flex gap-2 border-b border-primary-400"
        role="tablist"
      >
        {views.map((view) => (
          <button
            key={view.key}
            aria-controls={`${view.key}-panel`}
            aria-selected={activeView === view.key}
            id={`${view.key}-tab`}
            onClick={() => setActiveView(view.key)}
            role="tab"
            className={`rounded-t-md px-4 py-2 text-sm font-medium ${
              activeView === view.key
                ? "border-b-2 border-primary-300 text-default"
                : "text-muted hover:text-default"
            }`}
          >
            {view.label}
          </button>
        ))}
      </nav>

      <section
        aria-labelledby={`${activeView}-tab`}
        id={`${activeView}-panel`}
        role="tabpanel"
      >
        {renderView()}
      </section>
    </div>
  );
}
