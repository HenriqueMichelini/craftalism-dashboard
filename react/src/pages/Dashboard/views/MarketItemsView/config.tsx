import type { TableConfig } from "../../../../types/table.types.js";
import type { MarketItem } from "../../../../types/models/marketItem.types.js";
import { formatters } from "../../../../utils/formatters.js";

const monoCellClassName = "font-mono text-sm text-default";

function renderBooleanBadge(value: MarketItem[keyof MarketItem]) {
  const enabled = value === true;
  const label = enabled ? "Yes" : "No";
  const className = enabled
    ? "bg-red-400/15 text-red-300 ring-red-300/30"
    : "bg-green-400/15 text-green-300 ring-green-300/30";

  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ring-1 ${className}`}
    >
      {label}
    </span>
  );
}

function renderOperatingBadge(value: MarketItem[keyof MarketItem]) {
  const operating = value === true;
  const label = operating ? "Yes" : "No";
  const className = operating
    ? "bg-green-400/15 text-green-300 ring-green-300/30"
    : "bg-red-400/15 text-red-300 ring-red-300/30";

  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ring-1 ${className}`}
    >
      {label}
    </span>
  );
}

export const marketItemsTableConfig: TableConfig<MarketItem> = {
  rowKey: "itemId",
  columns: [
    {
      key: "displayName",
      label: "Item",
      className: "font-medium text-default",
    },
    {
      key: "categoryDisplayName",
      label: "Category",
      className: "text-default",
    },
    {
      key: "buyUnitEstimate",
      label: "Buy Estimate",
      render: (value, item) => formatters.currency(value as number, item.currency),
      className: monoCellClassName,
    },
    {
      key: "sellUnitEstimate",
      label: "Sell Estimate",
      render: (value, item) => formatters.currency(value as number, item.currency),
      className: monoCellClassName,
    },
    {
      key: "currency",
      label: "Currency",
      className: monoCellClassName,
    },
    {
      key: "currentStock",
      label: "Stock",
      render: (value) => formatters.number(value as number),
      className: monoCellClassName,
    },
    {
      key: "variationPercent",
      label: "Variation %",
      render: (value) => `${formatters.number(value as number)}%`,
      className: monoCellClassName,
    },
    {
      key: "blocked",
      label: "Blocked",
      render: renderBooleanBadge,
    },
    {
      key: "operating",
      label: "Operating",
      render: renderOperatingBadge,
    },
    {
      key: "lastUpdatedAt",
      label: "Last Updated",
      render: (value) => formatters.date(value as string),
      className: monoCellClassName,
    },
  ],
};
