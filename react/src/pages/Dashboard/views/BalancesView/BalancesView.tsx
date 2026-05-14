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
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const playerUuids = players.map((player) => player.uuid);

  const closeModal = () => {
    setMutationError(null);
    setModalState(null);
  };

  const handleMutationError = (error: unknown, fallbackMessage: string) => {
    setMutationError(
      error instanceof Error ? error.message : fallbackMessage,
    );
  };

  const handleSave = async (balance: Balance) => {
    if (!modalState) return;

    setSubmitting(true);
    setMutationError(null);

    try {
      const savedBalance =
        modalState.mode === "edit"
          ? await balancesApi.update(modalState.balance.uuid, {
              amount: balance.amount,
            })
          : await balancesApi.create({
              uuid: balance.uuid,
              amount: balance.amount,
            });

      setData((currentBalances) => {
        if (modalState.mode === "edit") {
          return currentBalances.map((currentBalance) =>
            currentBalance.uuid === modalState.balance.uuid
              ? savedBalance
              : currentBalance,
          );
        }

        return [...currentBalances, savedBalance];
      });
      closeModal();
    } catch (error) {
      handleMutationError(error, "Failed to save balance.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (balance: Balance) => {
    setSubmitting(true);
    setMutationError(null);

    try {
      await balancesApi.delete(balance.uuid);
      setData((currentBalances) =>
        currentBalances.filter(
          (currentBalance) => currentBalance.uuid !== balance.uuid,
        ),
      );
      closeModal();
    } catch (error) {
      handleMutationError(error, "Failed to delete balance.");
    } finally {
      setSubmitting(false);
    }
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
          actionError={mutationError}
          submitting={submitting}
          onCancel={closeModal}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
