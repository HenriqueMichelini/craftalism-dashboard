import type { TableConfig } from "../../../../types/table.types.js";
import type { MarketTrade } from "../../../../types/models/marketTrade.types.js";
import { formatters } from "../../../../utils/formatters.js";

const monoCellClassName = "font-mono text-sm text-default";

function renderTradeType(value: MarketTrade[keyof MarketTrade]) {
  const type = value === "sell" ? "Sell" : "Buy";
  const className =
    value === "sell"
      ? "bg-amber-400/15 text-amber-300 ring-amber-300/30"
      : "bg-green-400/15 text-green-300 ring-green-300/30";

  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ring-1 ${className}`}
    >
      {type}
    </span>
  );
}

export const marketTradesTableConfig: TableConfig<MarketTrade> = {
  columns: [
    {
      key: "id",
      label: "Id",
      className: monoCellClassName,
    },
    {
      key: "type",
      label: "Type",
      render: renderTradeType,
    },
    {
      key: "playerUuid",
      label: "Player",
      className: monoCellClassName,
    },
    {
      key: "itemId",
      label: "Item",
      className: monoCellClassName,
    },
    {
      key: "quantity",
      label: "Quantity",
      className: monoCellClassName,
    },
    {
      key: "unitPrice",
      label: "Unit Price",
      render: (value) => formatters.currency(value as number),
      className: monoCellClassName,
    },
    {
      key: "totalPrice",
      label: "Total Price",
      render: (value) => formatters.currency(value as number),
      className: monoCellClassName,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => formatters.date(value as string),
      className: monoCellClassName,
    },
  ],
  rowKey: "id",
};
