import { useCallback, useState } from "react";
import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import { TableFilters } from "../../../../../components/ui/TableFilters.js";
import type { TableFilterValues } from "../../../../../components/ui/tableFilterState.js";
import { useTableData } from "../../../../../hooks/useTableData.js";
import { transactionsApi } from "../../../../../api/endpoints/transactions.js";
import { transactionsTableConfig } from "../config.js";
import {
  getTransactionEmptyMessage,
  hasActiveTableFilters,
  toTransactionApiFilters,
  transactionFilterFields,
} from "../filterConfig.js";

export function TransactionTable() {
  const [activeFilters, setActiveFilters] = useState<TableFilterValues>({});
  const hasFilters = hasActiveTableFilters(activeFilters);
  const fetchTransactions = useCallback(
    () => transactionsApi.getAll(toTransactionApiFilters(activeFilters)),
    [activeFilters],
  );
  const { data, loading, error, refetch } = useTableData(fetchTransactions);

  const applyFilters = (filters: TableFilterValues) => {
    setActiveFilters(filters);
  };

  const resetFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className="space-y-4">
      <TableFilters
        fields={transactionFilterFields}
        onApply={applyFilters}
        onReset={resetFilters}
      />
      <DynamicTable
        caption="Transactions table"
        data={data}
        loading={loading}
        error={error}
        config={transactionsTableConfig}
        onRetry={refetch}
        emptyMessage={getTransactionEmptyMessage(hasFilters)}
      />
    </div>
  );
}
