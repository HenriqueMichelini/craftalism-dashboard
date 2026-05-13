import { TransactionTable } from "./components/TransactionTable.js";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader.js";

export function TransactionsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Manage and view all registered transactions in the server."
      />
      <TransactionTable />
    </div>
  );
}
