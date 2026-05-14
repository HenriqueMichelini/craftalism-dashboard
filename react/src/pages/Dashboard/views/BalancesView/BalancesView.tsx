import { useState } from "react";
import { balancesApi } from "../../../../api/endpoints/balances.js";
import { playersApi } from "../../../../api/endpoints/players.js";
import { BalanceTable } from "./components/BalanceTable.js";
import { BalanceModalForm } from "./components/BalanceModalForm.js";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader.js";
import { useTableData } from "../../../../hooks/useTableData.js";
import type { Balance } from "../../../../types/models/balance.types.js";

type BalanceModalState =
  | { mode: "create"; balance?: undefined }
  | { mode: "edit"; balance: Balance };

export function BalancesView() {
  const {
    data: balances,
    loading,
    error,
    refetch,
    setData,
  } = useTableData(balancesApi.getAll);
  const { data: players } = useTableData(playersApi.getAll);
  const [modalState, setModalState] = useState<BalanceModalState | null>(null);
  const playerUuids = players.map((player) => player.uuid);

  const handleSave = (balance: Balance) => {
    setData((currentBalances) => {
      if (modalState?.mode === "edit") {
        return currentBalances.map((currentBalance) =>
          currentBalance.uuid === modalState.balance.uuid
            ? balance
            : currentBalance,
        );
      }

      return [...currentBalances, balance];
    });
    setModalState(null);
  };

  const handleDelete = (balance: Balance) => {
    setData((currentBalances) =>
      currentBalances.filter(
        (currentBalance) => currentBalance.uuid !== balance.uuid,
      ),
    );
    setModalState(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Balances"
        description="Manage and view all registered balances in the server."
        action={
          <button
            className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
            type="button"
            onClick={() => setModalState({ mode: "create" })}
          >
            Add Balance
          </button>
        }
      />
      <BalanceTable
        data={balances}
        loading={loading}
        error={error}
        onRetry={refetch}
        onBalanceClick={(balance) => setModalState({ mode: "edit", balance })}
      />
      {modalState ? (
        <BalanceModalForm
          mode={modalState.mode}
          balance={modalState.balance}
          playerUuids={playerUuids}
          onCancel={() => setModalState(null)}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
