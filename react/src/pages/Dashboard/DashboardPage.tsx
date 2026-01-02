import { useState } from "react";
import { PlayersView } from "./views";

export function DashboardPage() {
  const [activeView, setActiveView] = useState("overview");

  const renderView = () => {
    switch (activeView) {
      case "players":
        return <PlayersView />;
      // default:
      //   return <Overview />;
    }
  };

  return (
    <div>
      <nav className="mb-6 flex gap-4 border-b border-primary-400">
        {["overview", "users", "transactions", "balances"].map((view) => (
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
