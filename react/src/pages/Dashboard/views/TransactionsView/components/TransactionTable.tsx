import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import { useTableData } from "../../../../../hooks/useTableData.js";
import { transactionsApi } from "../../../../../api/endpoints/transactions.js";
import { transactionsTableConfig } from "../config.js";

export function TransactionTable() {
  const { data, loading, error, refetch } = useTableData(
    transactionsApi.getAll,
  );

  return (
    <DynamicTable
      caption="Transactions table"
      data={data}
      loading={loading}
      error={error}
      config={transactionsTableConfig}
      onRetry={refetch}
      emptyMessage="No transactions found."
    />
  );
}
