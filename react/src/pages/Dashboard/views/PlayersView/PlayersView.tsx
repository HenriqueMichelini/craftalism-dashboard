import { PlayerTable } from "./components/PlayerTable";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader";

export function PlayersView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Players"
        description="Manage and view all registered players in your system."
        action={
          <button className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300">
            Add Player
          </button>
        }
      />
      <PlayerTable />
    </div>
  );
}
