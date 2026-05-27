import type { TableConfig } from "../../../../types/table.types.js";
import type { MarketCategory } from "../../../../types/models/marketCategory.types.js";
import { formatters } from "../../../../utils/formatters.js";

export const marketCategoriesTableConfig: TableConfig<MarketCategory> = {
  rowKey: "categoryId",
  columns: [
    {
      key: "displayName",
      label: "Category",
      className: "font-medium text-default",
    },
    {
      key: "categoryId",
      label: "Category ID",
      className: "font-mono text-sm text-default",
    },
    {
      key: "iconKey",
      label: "Block/Item ID",
      className: "font-mono text-sm text-default",
    },
    {
      key: "displayOrder",
      label: "Order",
      className: "font-mono text-sm text-default",
    },
    {
      key: "updatedAt",
      label: "Updated",
      render: (value) => formatters.date(value as string),
      className: "font-mono text-sm text-default",
    },
  ],
};
