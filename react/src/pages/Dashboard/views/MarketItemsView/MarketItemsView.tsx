import { useRef, useState } from "react";
import { marketCategoriesApi } from "../../../../api/endpoints/marketCategories.js";
import { marketItemsApi } from "../../../../api/endpoints/marketItems.js";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader.js";
import { useTableData } from "../../../../hooks/useTableData.js";
import type { MarketItem } from "../../../../types/models/marketItem.types.js";
import { MarketItemModalForm } from "./components/MarketItemModalForm.js";
import { MarketItemTable } from "./components/MarketItemTable.js";
import { submitMarketDriftReset } from "./marketDriftResetAction.js";
import { removeMarketItemRow, upsertMarketItemRow } from "./marketItemRows.js";
import type { ValidMarketItemValues } from "./marketItemValidation.js";

type MarketItemModalState =
  | { mode: "create"; item?: undefined }
  | { mode: "edit"; item: MarketItem };

export function MarketItemsView() {
  const { data, loading, error, refetch, setData } = useTableData(
    marketItemsApi.getAll,
  );
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useTableData(marketCategoriesApi.getAll);
  const [modalState, setModalState] = useState<MarketItemModalState | null>(
    null,
  );
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetSubmitting, setResetSubmittingState] = useState(false);
  const resetSubmittingRef = useRef(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(
    null,
  );
  const [resetErrorMessage, setResetErrorMessage] = useState<string | null>(
    null,
  );

  const setResetSubmitting = (nextSubmitting: boolean) => {
    resetSubmittingRef.current = nextSubmitting;
    setResetSubmittingState(nextSubmitting);
  };

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

  const handleResetDrift = async () => {
    await submitMarketDriftReset({
      isSubmitting: () => resetSubmittingRef.current,
      confirm: (message) =>
        typeof window === "undefined" ? true : window.confirm(message),
      resetDrift: marketItemsApi.resetDrift,
      refreshRows: refetch,
      setSubmitting: setResetSubmitting,
      setSuccessMessage: setResetSuccessMessage,
      setErrorMessage: setResetErrorMessage,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Items"
        description="Manage market item pricing, stock, regeneration, and state controls."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-md border border-primary-300 px-4 py-2 text-sm font-medium text-default hover:bg-primary-400 disabled:cursor-not-allowed disabled:text-muted"
              disabled={resetSubmitting}
              type="button"
              onClick={handleResetDrift}
            >
              {resetSubmitting ? "Resetting..." : "Reset Drift"}
            </button>
            <button
              className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300 disabled:cursor-not-allowed disabled:text-muted"
              disabled={categories.length === 0 || Boolean(categoriesError)}
              type="button"
              onClick={() => setModalState({ mode: "create" })}
            >
              Add Market Item
            </button>
          </div>
        }
      />
      {resetSuccessMessage ? (
        <div className="rounded-md border border-green-400/50 bg-green-500/10 p-4 text-sm text-green-200">
          {resetSuccessMessage}
        </div>
      ) : null}
      {resetErrorMessage ? (
        <div className="rounded-md border border-red-400/50 bg-red-500/10 p-4 text-sm text-red-200">
          {resetErrorMessage}
        </div>
      ) : null}
      {categoriesError ? (
        <div className="rounded-md border border-red-400/50 bg-red-500/10 p-4 text-sm text-red-200">
          <p>{categoriesError}</p>
          <button
            className="mt-3 rounded-md border border-red-300 px-3 py-1 text-xs font-medium"
            type="button"
            onClick={refetchCategories}
          >
            Retry Categories
          </button>
        </div>
      ) : null}
      <MarketItemTable
        data={data}
        loading={loading || categoriesLoading}
        error={error}
        onRetry={refetch}
        onMarketItemClick={(item) => setModalState({ mode: "edit", item })}
      />
      {modalState ? (
        <MarketItemModalForm
          mode={modalState.mode}
          item={modalState.item}
          categories={categories}
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
