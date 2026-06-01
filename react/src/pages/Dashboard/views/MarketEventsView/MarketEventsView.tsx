import { useRef, useState } from "react";
import { marketEventsApi } from "../../../../api/endpoints/marketEvents.js";
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
  const [modalState, setModalState] = useState<MarketEventModalState | null>(
    null,
  );
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [submitting, setSubmittingState] = useState(false);
  const submittingRef = useRef(false);

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
            type="button"
            onClick={() => setModalState({ mode: "create" })}
          >
            Add Market Event
          </button>
        }
      />
      <MarketEventTable
        data={data}
        loading={loading}
        error={error}
        onRetry={refetch}
        onMarketEventClick={(event) => setModalState({ mode: "edit", event })}
      />
      {modalState ? (
        <MarketEventModalForm
          mode={modalState.mode}
          event={modalState.event}
          actionError={mutationError}
          submitting={submitting}
          onCancel={closeModal}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
