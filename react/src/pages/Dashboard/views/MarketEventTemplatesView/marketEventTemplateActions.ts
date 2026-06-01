import type { MarketEventTemplate } from "../../../../types/models/marketEventTemplate.types.js";

type SubmitMarketEventTemplateSaveOptions = {
  isSubmitting: () => boolean;
  save: () => Promise<MarketEventTemplate>;
  insertRow: (template: MarketEventTemplate) => void;
  closeModal: () => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (message: string | null) => void;
};

export async function submitMarketEventTemplateSave({
  isSubmitting,
  save,
  insertRow,
  closeModal,
  setSubmitting,
  setError,
}: SubmitMarketEventTemplateSaveOptions) {
  if (isSubmitting()) return;

  setSubmitting(true);
  setError(null);

  try {
    const savedTemplate = await save();

    insertRow(savedTemplate);
    closeModal();
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Failed to save market event template.",
    );
  } finally {
    setSubmitting(false);
  }
}
