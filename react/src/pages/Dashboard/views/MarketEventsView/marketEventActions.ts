import type {
  MarketEvent,
  MarketEventCancelRequest,
  MarketEventCreateRequest,
} from "../../../../types/models/marketEvent.types.js";

type SubmitMarketEventSaveOptions = {
  isSubmitting: () => boolean;
  save: () => Promise<MarketEvent>;
  updateRows: (event: MarketEvent) => void;
  refreshRows?: () => Promise<void>;
  closeModal: () => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (message: string | null) => void;
};

type SubmitMarketEventCancelOptions = Omit<
  SubmitMarketEventSaveOptions,
  "save" | "refreshRows"
> & {
  eventId: string;
  reason: string;
  confirm: (message: string) => boolean;
  cancel: (id: string, request: MarketEventCancelRequest) => Promise<MarketEvent>;
};

type SubmitMarketEventSupersedeOptions = Omit<
  SubmitMarketEventSaveOptions,
  "save"
> & {
  request: MarketEventCreateRequest;
  supersede: (request: MarketEventCreateRequest) => Promise<MarketEvent>;
};

function toOptionalReason(reason: string): string | null {
  return reason.trim() || null;
}

export async function submitMarketEventSave({
  isSubmitting,
  save,
  updateRows,
  refreshRows,
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
    await refreshRows?.();
    closeModal();
  } catch (error) {
    setError(error instanceof Error ? error.message : "Failed to save market event.");
  } finally {
    setSubmitting(false);
  }
}

export async function submitMarketEventCancel({
  eventId,
  reason,
  confirm,
  cancel,
  ...saveOptions
}: SubmitMarketEventCancelOptions): Promise<void> {
  if (saveOptions.isSubmitting()) {
    return;
  }

  if (!confirm(`Cancel market event "${eventId}"?`)) {
    return;
  }

  await submitMarketEventSave({
    ...saveOptions,
    save: () => cancel(eventId, { reason: toOptionalReason(reason) }),
  });
}

export async function submitMarketEventSupersede({
  request,
  supersede,
  ...saveOptions
}: SubmitMarketEventSupersedeOptions): Promise<void> {
  await submitMarketEventSave({
    ...saveOptions,
    save: () => supersede(request),
  });
}
