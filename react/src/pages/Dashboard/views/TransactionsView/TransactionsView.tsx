import { TransactionTable } from "./components/TransactionTable";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader";

export function TransactionsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Manage and view all registered transactions in the server."
        action={
          <button className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300">
            Add Player
          </button>
        }
      />
      <TransactionTable />
    </div>
  );
}
