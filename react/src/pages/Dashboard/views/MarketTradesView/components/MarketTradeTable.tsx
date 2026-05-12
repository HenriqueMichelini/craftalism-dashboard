import { useCallback, useState } from "react";
import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import { TableFilters } from "../../../../../components/ui/TableFilters.js";
import type { TableFilterValues } from "../../../../../components/ui/tableFilterState.js";
import { useTableData } from "../../../../../hooks/useTableData.js";
import { marketTradesApi } from "../../../../../api/endpoints/marketTrades.js";
import { marketTradesTableConfig } from "../config.js";
import {
  getMarketTradeEmptyMessage,
  hasActiveMarketTradeFilters,
  marketTradeFilterFields,
  toMarketTradeApiFilters,
} from "../filterConfig.js";

export function MarketTradeTable() {
  const [activeFilters, setActiveFilters] = useState<TableFilterValues>({});
  const hasFilters = hasActiveMarketTradeFilters(activeFilters);
  const fetchMarketTrades = useCallback(
    () => marketTradesApi.getAll(toMarketTradeApiFilters(activeFilters)),
    [activeFilters],
  );
  const { data, loading, error, refetch } = useTableData(fetchMarketTrades);

  const applyFilters = (filters: TableFilterValues) => {
    setActiveFilters(filters);
  };

  const resetFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className="space-y-4">
      <TableFilters
        fields={marketTradeFilterFields}
        onApply={applyFilters}
        onReset={resetFilters}
      />
      <DynamicTable
        caption="Market trades table"
        data={data}
        loading={loading}
        error={error}
        config={marketTradesTableConfig}
        onRetry={refetch}
        emptyMessage={getMarketTradeEmptyMessage(hasFilters)}
      />
    </div>
  );
}
