import { useCallback } from "react";
import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import { useTableData } from "../../../../../hooks/useTableData.js";
import { marketEventsApi } from "../../../../../api/endpoints/marketEvents.js";
import { marketEventsTableConfig } from "../config.js";

export function MarketEventTable() {
  const fetchMarketEvents = useCallback(() => marketEventsApi.getAll(), []);
  const { data, loading, error, refetch } = useTableData(fetchMarketEvents);

  return (
    <DynamicTable
      caption="Market events table"
      data={data}
      loading={loading}
      error={error}
      config={marketEventsTableConfig}
      onRetry={refetch}
      emptyMessage="No market events found."
    />
  );
}
