import type { MarketTradeFilters } from "../../../../types/models/marketTrade.types.js";
import type { TableFilterField } from "../../../../types/table.types.js";
import type { TableFilterValues } from "../../../../components/ui/tableFilterState.js";
import { toApiAmount } from "../../../../utils/formatters.js";

export const marketTradeFilterFields: TableFilterField[] = [
  {
    kind: "enum",
    key: "type",
    label: "Type",
    options: [
      { label: "All", value: "" },
      { label: "Buy", value: "buy" },
      { label: "Sell", value: "sell" },
    ],
  },
  {
    kind: "text",
    key: "playerUuid",
    label: "Player UUID",
  },
  {
    kind: "text",
    key: "itemId",
    label: "Item ID",
  },
  {
    kind: "matchMode",
    key: "matchMode",
    label: "Text Match",
  },
  {
    kind: "numberRange",
    minKey: "minTotalPrice",
    maxKey: "maxTotalPrice",
    label: "Total Price",
  },
  {
    kind: "dateRange",
    fromKey: "createdFrom",
    toKey: "createdTo",
    label: "Created",
  },
];

function toInstant(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  if (value.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  return new Date(value).toISOString();
}

export function hasActiveMarketTradeFilters(
  filters: TableFilterValues,
): boolean {
  return Object.values(filters).some((value) => value.trim().length > 0);
}

export function getMarketTradeEmptyMessage(hasActiveFilters: boolean): string {
  return hasActiveFilters
    ? "No records match the selected filters."
    : "No market trades found.";
}

export function toMarketTradeApiFilters(
  filters: TableFilterValues,
): MarketTradeFilters {
  return {
    type: filters.type === "buy" || filters.type === "sell"
      ? filters.type
      : undefined,
    playerUuid: filters.playerUuid,
    itemId: filters.itemId,
    matchMode: filters.matchMode === "exact" ? "exact" : "contains",
    minTotalPrice: toApiAmount(filters.minTotalPrice),
    maxTotalPrice: toApiAmount(filters.maxTotalPrice),
    createdFrom: toInstant(filters.createdFrom),
    createdTo: toInstant(filters.createdTo),
  };
}
