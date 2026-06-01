import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import type { MarketEvent } from "../../../../../types/models/marketEvent.types.js";
import { marketEventsTableConfig } from "../config.js";

type MarketEventTableProps = {
  data: MarketEvent[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onMarketEventClick: (event: MarketEvent) => void;
};

export function MarketEventTable({
  data,
  loading,
  error,
  onRetry,
  onMarketEventClick,
}: MarketEventTableProps) {
  return (
    <DynamicTable
      caption="Market events table"
      data={data}
      loading={loading}
      error={error}
      config={marketEventsTableConfig}
      onRetry={onRetry}
      onRowClick={onMarketEventClick}
      emptyMessage="No market events found."
    />
  );
}
