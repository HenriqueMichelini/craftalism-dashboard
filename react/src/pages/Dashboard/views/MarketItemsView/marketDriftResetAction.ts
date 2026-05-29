import { ApiError } from "../../../../api/client.js";
import type { MarketDriftResetResponse } from "../../../../types/models/marketItem.types.js";

const MARKET_DRIFT_RESET_CONFIRMATION =
  "Reset persisted market drift for all market items?";

type MarketDriftResetActionOptions = {
  isSubmitting: () => boolean;
  confirm: (message: string) => boolean;
  resetDrift: () => Promise<MarketDriftResetResponse>;
  refreshRows: () => Promise<void>;
  setSubmitting: (submitting: boolean) => void;
  setSuccessMessage: (message: string | null) => void;
  setErrorMessage: (message: string | null) => void;
};

function formatResetCount(count: number): string {
  return `${count} market item${count === 1 ? "" : "s"}`;
}

function toResetErrorMessage(error: unknown): string {
  if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
    return "Admin authorization is required to reset market drift.";
  }

  return error instanceof Error ? error.message : "Failed to reset market drift.";
}

export async function submitMarketDriftReset({
  isSubmitting,
  confirm,
  resetDrift,
  refreshRows,
  setSubmitting,
  setSuccessMessage,
  setErrorMessage,
}: MarketDriftResetActionOptions): Promise<void> {
  if (isSubmitting()) {
    return;
  }

  if (!confirm(MARKET_DRIFT_RESET_CONFIRMATION)) {
    return;
  }

  setSubmitting(true);
  setSuccessMessage(null);
  setErrorMessage(null);

  try {
    const response = await resetDrift();
    await refreshRows();
    setSuccessMessage(`Reset drift for ${formatResetCount(response.resetItemCount)}.`);
  } catch (error) {
    setErrorMessage(toResetErrorMessage(error));
  } finally {
    setSubmitting(false);
  }
}
