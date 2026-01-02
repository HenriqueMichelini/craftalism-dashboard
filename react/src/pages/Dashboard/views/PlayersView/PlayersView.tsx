import { PlayerTable } from "./components/PlayerTable";

export function PlayersView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Players</h2>
        <button className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300">
          Add Player
        </button>
      </div>
      <PlayerTable />
    </div>
  );
}
