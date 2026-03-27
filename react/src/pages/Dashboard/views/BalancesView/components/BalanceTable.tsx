import { DynamicTable } from "../../../../../components/ui/Table";
import { useTableData } from "../../../../../hooks/useTableData";
import { balancesApi } from "../../../../../api";
import { balancesTableConfig } from "../config";

export function BalanceTable() {
  const { data, loading, error, refetch } = useTableData(balancesApi.getAll);

  return (
    <DynamicTable
      caption="Balances table"
      data={data}
      loading={loading}
      error={error}
      config={balancesTableConfig}
      onRetry={refetch}
      emptyMessage="No balances found."
    />
  );
}
