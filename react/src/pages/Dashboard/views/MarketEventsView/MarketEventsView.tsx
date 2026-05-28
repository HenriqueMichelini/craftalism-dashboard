import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader.js";
import { MarketEventTable } from "./components/MarketEventTable.js";

export function MarketEventsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Events"
        description="Inspect API-owned market event state for dashboard operations."
      />
      <MarketEventTable />
    </div>
  );
}
