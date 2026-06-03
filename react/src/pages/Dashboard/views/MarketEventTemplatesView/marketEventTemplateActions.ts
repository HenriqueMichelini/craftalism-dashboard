import type { MarketEventTemplate } from "../../../../types/models/marketEventTemplate.types.js";

type SubmitMarketEventTemplateSaveOptions = {
  isSubmitting: () => boolean;
  save: () => Promise<MarketEventTemplate>;
  applyRow: (template: MarketEventTemplate) => void;
  closeModal: () => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (message: string | null) => void;
};

export async function submitMarketEventTemplateSave({
  isSubmitting,
  save,
  applyRow,
  closeModal,
  setSubmitting,
  setError,
}: SubmitMarketEventTemplateSaveOptions) {
  if (isSubmitting()) return;

  setSubmitting(true);
  setError(null);

  try {
    const savedTemplate = await save();

    applyRow(savedTemplate);
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

type SubmitMarketEventTemplateDeleteOptions = {
  isSubmitting: () => boolean;
  template: MarketEventTemplate;
  remove: () => Promise<void>;
  removeRow: (template: MarketEventTemplate) => void;
  closeModal: () => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (message: string | null) => void;
};

export async function submitMarketEventTemplateDelete({
  isSubmitting,
  template,
  remove,
  removeRow,
  closeModal,
  setSubmitting,
  setError,
}: SubmitMarketEventTemplateDeleteOptions) {
  if (isSubmitting()) return;

  setSubmitting(true);
  setError(null);

  try {
    await remove();

    removeRow(template);
    closeModal();
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Failed to delete market event template.",
    );
  } finally {
    setSubmitting(false);
  }
}
