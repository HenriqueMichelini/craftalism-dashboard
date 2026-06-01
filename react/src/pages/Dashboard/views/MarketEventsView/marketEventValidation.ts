import type {
  MarketEventCreateRequest,
  MarketEventScope,
  MarketEventUpdateRequest,
} from "../../../../types/models/marketEvent.types.js";

export type MarketEventFormValues = {
  templateId: string;
  scope: MarketEventScope | "";
  selectedCategoryId: string;
  selectedItemIds: string;
  effectBasisPoints: string;
  blocking: boolean;
  durationSeconds: string;
  endsAt: string;
  reason: string;
};

export type ValidMarketEventValues = {
  createRequest: MarketEventCreateRequest;
  updateRequest: MarketEventUpdateRequest;
};

export type MarketEventValidationResult =
  | { valid: true; values: ValidMarketEventValues }
  | {
      valid: false;
      errors: Partial<Record<keyof MarketEventFormValues, string>>;
    };

export const marketEventCreateDefaults: MarketEventFormValues = {
  templateId: "",
  scope: "",
  selectedCategoryId: "",
  selectedItemIds: "",
  effectBasisPoints: "",
  blocking: false,
  durationSeconds: "",
  endsAt: "",
  reason: "",
};

function parseOptionalInteger(
  rawValue: string,
  key: keyof MarketEventFormValues,
  errors: Partial<Record<keyof MarketEventFormValues, string>>,
): number | undefined {
  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const numericValue = Number(trimmedValue);

  if (!Number.isInteger(numericValue)) {
    errors[key] = "Enter a whole number.";
    return undefined;
  }

  return numericValue;
}

function emptyToUndefined(value: string): string | undefined {
  const trimmedValue = value.trim();

  return trimmedValue || undefined;
}

export function validateMarketEventForm(
  values: MarketEventFormValues,
): MarketEventValidationResult {
  const errors: Partial<Record<keyof MarketEventFormValues, string>> = {};
  const templateId = values.templateId.trim();

  if (!templateId) {
    errors.templateId = "This field is required.";
  }
  if (!values.scope) {
    errors.scope = "Select a scope.";
  }

  const effectBasisPoints = parseOptionalInteger(
    values.effectBasisPoints,
    "effectBasisPoints",
    errors,
  );
  const durationSeconds = parseOptionalInteger(
    values.durationSeconds,
    "durationSeconds",
    errors,
  );

  if (durationSeconds !== undefined && durationSeconds <= 0) {
    errors.durationSeconds = "Must be greater than 0.";
  }

  let endsAt: string | undefined;
  const trimmedEndsAt = values.endsAt.trim();

  if (trimmedEndsAt) {
    const parsedEndsAt = new Date(trimmedEndsAt);

    if (Number.isNaN(parsedEndsAt.getTime())) {
      errors.endsAt = "Enter a valid date.";
    } else {
      endsAt = parsedEndsAt.toISOString();
    }
  }

  if (Object.keys(errors).length > 0 || !values.scope) {
    return { valid: false, errors };
  }

  const reason = emptyToUndefined(values.reason);
  const updateRequest: MarketEventUpdateRequest = {
    effectBasisPoints,
    blocking: values.blocking,
    durationSeconds,
    endsAt,
    reason,
  };

  return {
    valid: true,
    values: {
      createRequest: {
        templateId,
        scope: values.scope,
        selectedCategoryId: emptyToUndefined(values.selectedCategoryId),
        selectedItemIds: emptyToUndefined(values.selectedItemIds),
        effectBasisPoints,
        blocking: values.blocking,
        durationSeconds,
        reason,
      },
      updateRequest,
    },
  };
}
