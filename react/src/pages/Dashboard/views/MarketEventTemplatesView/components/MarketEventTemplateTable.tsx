import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import type { MarketEventTemplate } from "../../../../../types/models/marketEventTemplate.types.js";
import { marketEventTemplatesTableConfig } from "../config.js";

type MarketEventTemplateTableProps = {
  data: MarketEventTemplate[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit?: (template: MarketEventTemplate) => void;
};

export function MarketEventTemplateTable({
  data,
  loading,
  error,
  onRetry,
  onEdit,
}: MarketEventTemplateTableProps) {
  return (
    <DynamicTable
      caption="Market event templates table"
      config={marketEventTemplatesTableConfig}
      data={data}
      loading={loading}
      error={error}
      onRetry={onRetry}
      emptyMessage="No market event templates found."
      renderRowActions={
        onEdit
          ? (template) => (
              <button
                className="rounded-md border border-primary-300 px-3 py-1 text-sm font-medium text-default hover:bg-primary-400"
                type="button"
                onClick={() => onEdit(template)}
              >
                Edit
              </button>
            )
          : undefined
      }
    />
  );
}
