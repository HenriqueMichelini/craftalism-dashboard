import { useState } from "react";
import { marketItemsApi } from "../../../../api/endpoints/marketItems.js";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader.js";
import { useTableData } from "../../../../hooks/useTableData.js";
import type { MarketItem } from "../../../../types/models/marketItem.types.js";
import { MarketItemModalForm } from "./components/MarketItemModalForm.js";
import { MarketItemTable } from "./components/MarketItemTable.js";
import { removeMarketItemRow, upsertMarketItemRow } from "./marketItemRows.js";
import type { ValidMarketItemValues } from "./marketItemValidation.js";

type MarketItemModalState =
  | { mode: "create"; item?: undefined }
  | { mode: "edit"; item: MarketItem };

export function MarketItemsView() {
  const { data, loading, error, refetch, setData } = useTableData(
    marketItemsApi.getAll,
  );
  const [modalState, setModalState] = useState<MarketItemModalState | null>(
    null,
  );
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const closeModal = () => {
    setMutationError(null);
    setModalState(null);
  };

  const handleMutationError = (error: unknown, fallbackMessage: string) => {
    setMutationError(error instanceof Error ? error.message : fallbackMessage);
  };

  const handleSave = async (values: ValidMarketItemValues) => {
    if (!modalState) return;

    setSubmitting(true);
    setMutationError(null);

    try {
      const savedItem =
        modalState.mode === "edit"
          ? await marketItemsApi.update(
              modalState.item.itemId,
              values.updateRequest,
            )
          : await marketItemsApi.create(values.createRequest);

      setData((currentItems) => upsertMarketItemRow(currentItems, savedItem));
      closeModal();
    } catch (error) {
      handleMutationError(error, "Failed to save market item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: MarketItem) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Remove market item "${item.displayName}"?`)
    ) {
      return;
    }

    setSubmitting(true);
    setMutationError(null);

    try {
      await marketItemsApi.delete(item.itemId);
      setData((currentItems) => removeMarketItemRow(currentItems, item.itemId));
      closeModal();
    } catch (error) {
      handleMutationError(error, "Failed to remove market item.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Items"
        description="Manage market item pricing, stock, regeneration, and state controls."
        action={
          <button
            className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
            type="button"
            onClick={() => setModalState({ mode: "create" })}
          >
            Add Market Item
          </button>
        }
      />
      <MarketItemTable
        data={data}
        loading={loading}
        error={error}
        onRetry={refetch}
        onMarketItemClick={(item) => setModalState({ mode: "edit", item })}
      />
      {modalState ? (
        <MarketItemModalForm
          mode={modalState.mode}
          item={modalState.item}
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
