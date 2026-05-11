import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import { useTableData } from "../../../../../hooks/useTableData.js";
import { marketTradesApi } from "../../../../../api/endpoints/marketTrades.js";
import { marketTradesTableConfig } from "../config.js";

export function MarketTradeTable() {
  const { data, loading, error, refetch } = useTableData(
    marketTradesApi.getAll,
  );

  return (
    <DynamicTable
      caption="Market trades table"
      data={data}
      loading={loading}
      error={error}
      config={marketTradesTableConfig}
      onRetry={refetch}
      emptyMessage="No market trades found."
    />
  );
}
