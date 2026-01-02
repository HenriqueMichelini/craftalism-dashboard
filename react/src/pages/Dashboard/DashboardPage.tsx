import { useState } from "react";
import { PlayersView } from "./views";

type ViewType = "overview" | "players" | "transactions" | "balances";

export function DashboardPage() {
  const [activeView, setActiveView] = useState<ViewType>("players");

  const renderView = () => {
    switch (activeView) {
      case "players":
        return <PlayersView />;
      case "overview":
        return (
          <div className="flex items-center justify-center p-12">
            <p className="text-muted">Overview - Coming soon</p>
          </div>
        );
      case "transactions":
        return (
          <div className="flex items-center justify-center p-12">
            <p className="text-muted">Transactions - Coming soon</p>
          </div>
        );
      case "balances":
        return (
          <div className="flex items-center justify-center p-12">
            <p className="text-muted">Balances - Coming soon</p>
          </div>
        );
      default:
        return <PlayersView />;
    }
  };

  return (
    <div>
      <nav className="mb-6 flex gap-4 border-b border-primary-400">
        {(
          ["players", "overview", "transactions", "balances"] as ViewType[]
        ).map((view) => (
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
