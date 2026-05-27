import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import type { MarketCategory } from "../../../../../types/models/marketCategory.types.js";
import { marketCategoriesTableConfig } from "../config.js";

type MarketCategoryTableProps = {
  data: MarketCategory[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onMarketCategoryClick: (category: MarketCategory) => void;
};

export function MarketCategoryTable({
  data,
  loading,
  error,
  onRetry,
  onMarketCategoryClick,
}: MarketCategoryTableProps) {
  return (
    <DynamicTable
      caption="Market categories table"
      data={data}
      loading={loading}
      error={error}
      config={marketCategoriesTableConfig}
      onRetry={onRetry}
      onRowClick={onMarketCategoryClick}
      emptyMessage="No market categories found."
    />
  );
}
