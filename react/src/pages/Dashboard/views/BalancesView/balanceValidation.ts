import { AMOUNT_SCALE } from "../../../../utils/formatters.js";

export type BalanceFormValues = {
  uuid: string;
  amount: string;
};

export type ValidBalanceValues = {
  uuid: string;
  amount: number;
};

export type BalanceValidationResult =
  | { valid: true; values: ValidBalanceValues }
  | { valid: false; errors: Partial<Record<keyof BalanceFormValues, string>> };

export function toBalanceFormAmount(amount: number): string {
  return String(amount / AMOUNT_SCALE);
}

export function validateBalanceForm(
  values: BalanceFormValues,
  existingPlayerUuids: string[],
): BalanceValidationResult {
  const uuid = values.uuid.trim();
  const amount = values.amount.trim();
  const errors: Partial<Record<keyof BalanceFormValues, string>> = {};

  if (!uuid) {
    errors.uuid = "Player UUID is required.";
  } else if (
    !existingPlayerUuids.some(
      (playerUuid) => playerUuid.toLowerCase() === uuid.toLowerCase(),
    )
  ) {
    errors.uuid = "Player UUID must match an existing player.";
  }

  if (!amount) {
    errors.amount = "Balance amount is required.";
  } else {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
      errors.amount = "Balance amount must be a valid number.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    values: {
      uuid,
      amount: Math.round(Number(amount) * AMOUNT_SCALE),
    },
  };
}
