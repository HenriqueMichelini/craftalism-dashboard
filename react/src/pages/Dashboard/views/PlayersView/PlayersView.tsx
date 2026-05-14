import { useState } from "react";
import { playersApi } from "../../../../api/endpoints/players.js";
import { PlayerTable } from "./components/PlayerTable.js";
import { PlayerModalForm } from "./components/PlayerModalForm.js";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader.js";
import { useTableData } from "../../../../hooks/useTableData.js";
import type { Player } from "../../../../types/models/player.types.js";

type PlayerModalState =
  | { mode: "create"; player?: undefined }
  | { mode: "edit"; player: Player };

export function PlayersView() {
  const { data, loading, error, refetch, setData } = useTableData(
    playersApi.getAll,
  );
  const [modalState, setModalState] = useState<PlayerModalState | null>(null);

  const handleSave = (player: Player) => {
    setData((currentPlayers) => {
      if (modalState?.mode === "edit") {
        return currentPlayers.map((currentPlayer) =>
          currentPlayer.uuid === modalState.player.uuid ? player : currentPlayer,
        );
      }

      return [...currentPlayers, player];
    });
    setModalState(null);
  };

  const handleDelete = (player: Player) => {
    setData((currentPlayers) =>
      currentPlayers.filter(
        (currentPlayer) => currentPlayer.uuid !== player.uuid,
      ),
    );
    setModalState(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Players"
        description="Manage and view all registered players in your system."
        action={
          <button
            className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
            type="button"
            onClick={() => setModalState({ mode: "create" })}
          >
            Add Player
          </button>
        }
      />
      <PlayerTable
        data={data}
        loading={loading}
        error={error}
        onRetry={refetch}
        onPlayerClick={(player) => setModalState({ mode: "edit", player })}
      />
      {modalState ? (
        <PlayerModalForm
          mode={modalState.mode}
          player={modalState.player}
          players={data}
          onCancel={() => setModalState(null)}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
