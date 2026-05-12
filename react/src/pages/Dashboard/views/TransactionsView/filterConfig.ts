import type { TransactionFilters } from "../../../../types/models/transaction.types.js";
import type { TableFilterField } from "../../../../types/table.types.js";
import type { TableFilterValues } from "../../../../components/ui/tableFilterState.js";

export const transactionFilterFields: TableFilterField[] = [
  {
    kind: "text",
    key: "fromPlayerUuid",
    label: "From Player UUID",
  },
  {
    kind: "text",
    key: "toPlayerUuid",
    label: "To Player UUID",
  },
  {
    kind: "matchMode",
    key: "matchMode",
    label: "Text Match",
  },
  {
    kind: "numberRange",
    minKey: "minAmount",
    maxKey: "maxAmount",
    label: "Amount",
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

export function hasActiveTableFilters(filters: TableFilterValues): boolean {
  return Object.values(filters).some((value) => value.trim().length > 0);
}

export function getTransactionEmptyMessage(hasActiveFilters: boolean): string {
  return hasActiveFilters
    ? "No records match the selected filters."
    : "No transactions found.";
}

export function toTransactionApiFilters(
  filters: TableFilterValues,
): TransactionFilters {
  return {
    fromPlayerUuid: filters.fromPlayerUuid,
    toPlayerUuid: filters.toPlayerUuid,
    matchMode: filters.matchMode === "exact" ? "exact" : "contains",
    minAmount: filters.minAmount,
    maxAmount: filters.maxAmount,
    createdFrom: toInstant(filters.createdFrom),
    createdTo: toInstant(filters.createdTo),
  };
}
