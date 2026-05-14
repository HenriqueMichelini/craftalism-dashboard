import { DynamicTable } from "../../../../../components/ui/Table/DynamicTable.js";
import { balancesTableConfig } from "../config.js";
import type { Balance } from "../../../../../types/models/balance.types.js";

type BalanceTableProps = {
  data: Balance[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onBalanceClick: (balance: Balance) => void;
};

export function BalanceTable({
  data,
  loading,
  error,
  onRetry,
  onBalanceClick,
}: BalanceTableProps) {
  return (
    <DynamicTable
      caption="Balances table"
      data={data}
      loading={loading}
      error={error}
      config={balancesTableConfig}
      onRetry={onRetry}
      onRowClick={onBalanceClick}
      emptyMessage="No balances found."
    />
  );
}
