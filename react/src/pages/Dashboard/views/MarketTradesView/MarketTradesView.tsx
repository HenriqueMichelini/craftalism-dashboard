import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader.js";
import { MarketTradeTable } from "./components/MarketTradeTable.js";

export function MarketTradesView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Trades"
        description="View buy and sell market trade operations in the server."
      />
      <MarketTradeTable />
    </div>
  );
}
