import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import { useTableData } from "../../../../../hooks/useTableData.js";
import { balancesApi } from "../../../../../api/endpoints/balances.js";
import { balancesTableConfig } from "../config.js";

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
