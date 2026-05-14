import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import { playersTableConfig } from "../config.js";
import type { Player } from "../../../../../types/models/player.types.js";

type PlayerTableProps = {
  data: Player[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onPlayerClick: (player: Player) => void;
};

export function PlayerTable({
  data,
  loading,
  error,
  onRetry,
  onPlayerClick,
}: PlayerTableProps) {
  return (
    <DynamicTable
      caption="Players table"
      data={data}
      loading={loading}
      error={error}
      config={playersTableConfig}
      onRetry={onRetry}
      onRowClick={onPlayerClick}
      emptyMessage="No players found."
    />
  );
}
