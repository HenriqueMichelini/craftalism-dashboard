import { useRef, useState } from "react";
import { marketCategoriesApi } from "../../../../api/endpoints/marketCategories.js";
import { marketEventsApi } from "../../../../api/endpoints/marketEvents.js";
import { marketEventTemplatesApi } from "../../../../api/endpoints/marketEventTemplates.js";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader.js";
import { useTableData } from "../../../../hooks/useTableData.js";
import type { MarketEvent } from "../../../../types/models/marketEvent.types.js";
import { submitMarketEventSave } from "./marketEventActions.js";
import { upsertMarketEventRow } from "./marketEventRows.js";
import type { ValidMarketEventValues } from "./marketEventValidation.js";
import { MarketEventModalForm } from "./components/MarketEventModalForm.js";
import { MarketEventTable } from "./components/MarketEventTable.js";

type MarketEventModalState =
  | { mode: "create"; event?: undefined }
  | { mode: "edit"; event: MarketEvent };

export function MarketEventsView() {
  const { data, loading, error, refetch, setData } = useTableData(
    marketEventsApi.getAll,
  );
  const {
    data: templates,
    loading: templatesLoading,
    error: templatesError,
    refetch: refetchTemplates,
  } = useTableData(marketEventTemplatesApi.getAll);
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useTableData(marketCategoriesApi.getAll);
  const [modalState, setModalState] = useState<MarketEventModalState | null>(
    null,
  );
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [submitting, setSubmittingState] = useState(false);
  const submittingRef = useRef(false);
  const referencesLoading = templatesLoading || categoriesLoading;

  const setSubmitting = (nextSubmitting: boolean) => {
    submittingRef.current = nextSubmitting;
    setSubmittingState(nextSubmitting);
  };

  const closeModal = () => {
    setMutationError(null);
    setModalState(null);
  };

  const handleSave = async (values: ValidMarketEventValues) => {
    if (!modalState) return;

    await submitMarketEventSave({
      isSubmitting: () => submittingRef.current,
      save: () =>
        modalState.mode === "edit"
          ? marketEventsApi.update(modalState.event.id, values.updateRequest)
          : marketEventsApi.create(values.createRequest),
      updateRows: (savedEvent) =>
        setData((currentEvents) =>
          upsertMarketEventRow(currentEvents, savedEvent),
        ),
      closeModal,
      setSubmitting,
      setError: setMutationError,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Events"
        description="Inspect API-owned market event state for dashboard operations."
        action={
          <button
            className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
            disabled={
              referencesLoading ||
              templates.length === 0 ||
              Boolean(templatesError) ||
              Boolean(categoriesError)
            }
            type="button"
            onClick={() => setModalState({ mode: "create" })}
          >
            Add Market Event
          </button>
        }
      />
      {templatesError ? (
        <div className="rounded-md border border-red-400/50 bg-red-500/10 p-4 text-sm text-red-200">
          <p>{templatesError}</p>
          <button
            className="mt-3 rounded-md border border-red-300 px-3 py-1 text-xs font-medium"
            type="button"
            onClick={refetchTemplates}
          >
            Retry Templates
          </button>
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
      <MarketEventTable
        data={data}
        loading={loading || referencesLoading}
        error={error}
        onRetry={refetch}
        onMarketEventClick={(event) => setModalState({ mode: "edit", event })}
      />
      {modalState ? (
        <MarketEventModalForm
          mode={modalState.mode}
          event={modalState.event}
          templates={templates}
          categories={categories}
          actionError={mutationError}
          submitting={submitting}
          onCancel={closeModal}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
