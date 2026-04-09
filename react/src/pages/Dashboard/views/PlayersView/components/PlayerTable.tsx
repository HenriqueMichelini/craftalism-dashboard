import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import { useTableData } from "../../../../../hooks/useTableData.js";
import { playersApi } from "../../../../../api/endpoints/players.js";
import { playersTableConfig } from "../config.js";

export function PlayerTable() {
  const { data, loading, error, refetch } = useTableData(playersApi.getAll);

  return (
    <DynamicTable
      caption="Players table"
      data={data}
      loading={loading}
      error={error}
      config={playersTableConfig}
      onRetry={refetch}
      emptyMessage="No players found."
    />
  );
}
