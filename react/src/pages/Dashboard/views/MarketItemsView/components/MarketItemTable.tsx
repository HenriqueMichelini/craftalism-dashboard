import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import type { MarketItem } from "../../../../../types/models/marketItem.types.js";
import { marketItemsTableConfig } from "../config.js";

type MarketItemTableProps = {
  data: MarketItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onMarketItemClick: (item: MarketItem) => void;
};

export function MarketItemTable({
  data,
  loading,
  error,
  onRetry,
  onMarketItemClick,
}: MarketItemTableProps) {
  return (
    <DynamicTable
      caption="Market items table"
      data={data}
      loading={loading}
      error={error}
      config={marketItemsTableConfig}
      onRetry={onRetry}
      onRowClick={onMarketItemClick}
      emptyMessage="No market items found."
    />
  );
}
