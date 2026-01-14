import { DynamicTable } from "../../../../../components/ui/Table";
import { useTableData } from "../../../../../hooks/useTableData";
import { transactionsApi } from "../../../../../api";
import { transactionsTableConfig } from "../config";

export function TransactionTable() {
  const { data, loading, error, refetch } = useTableData(
    transactionsApi.getAll,
  );

  return (
    <DynamicTable
      data={data}
      loading={loading}
      error={error}
      config={transactionsTableConfig}
      onRetry={refetch}
      emptyMessage="No players found."
    />
  );
}
