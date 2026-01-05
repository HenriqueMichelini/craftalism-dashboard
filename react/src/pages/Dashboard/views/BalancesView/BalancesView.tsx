import { BalanceTable } from "./components/BalanceTable";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader";

export function BalancesView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Balances"
        description="Manage and view all registered balances in the server."
        action={
          <button className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300">
            Add Balance
          </button>
        }
      />
      <BalanceTable />
    </div>
  );
}
