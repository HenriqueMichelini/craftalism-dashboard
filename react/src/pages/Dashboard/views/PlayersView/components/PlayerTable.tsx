import { DynamicTable } from "../../../../../components/ui/Table";
import { useTableData } from "../../../../../hooks/useTableData";
import { playersApi } from "../../../../../api";
import { playersTableConfig } from "../config";

export function PlayerTable() {
  const { data, loading, error, refetch } = useTableData(playersApi.getAll);

  return (
    <DynamicTable
      data={data}
      loading={loading}
      error={error}
      config={playersTableConfig}
      onRetry={refetch}
      emptyMessage="No players found."
    />
  );
}
