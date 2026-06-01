import type { MarketEvent } from "../../../../types/models/marketEvent.types.js";

type SubmitMarketEventSaveOptions = {
  isSubmitting: () => boolean;
  save: () => Promise<MarketEvent>;
  updateRows: (event: MarketEvent) => void;
  closeModal: () => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (message: string | null) => void;
};

export async function submitMarketEventSave({
  isSubmitting,
  save,
  updateRows,
  closeModal,
  setSubmitting,
  setError,
}: SubmitMarketEventSaveOptions) {
  if (isSubmitting()) {
    return;
  }

  setSubmitting(true);
  setError(null);

  try {
    const savedEvent = await save();

    updateRows(savedEvent);
    closeModal();
  } catch (error) {
    setError(error instanceof Error ? error.message : "Failed to save market event.");
  } finally {
    setSubmitting(false);
  }
}
