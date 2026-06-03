import type {
  MarketEventTemplate,
  MarketEventTemplateCreateRequest,
  MarketEventTemplateUpdateRequest,
} from "../../../../types/models/marketEventTemplate.types.js";
import type {
  MarketEventRarity,
  MarketEventScope,
} from "../../../../types/models/marketEvent.types.js";

export type MarketEventTemplateFormValues = {
  templateId: string;
  rarity: MarketEventRarity | "";
  scope: MarketEventScope | "";
  automaticWeight: string;
  automaticEnabled: boolean;
  blockingAllowed: boolean;
  minDurationSeconds: string;
  maxDurationSeconds: string;
  minEffectBasisPoints: string;
  maxEffectBasisPoints: string;
  effectDirection: string;
  cooldownSeconds: string;
  playerFacingName: string;
  playerFacingDescription: string;
  broadScopeHint: string;
  eligibleTargetMetadata: string;
};

export type MarketEventTemplateValidationResult =
  | {
      valid: true;
      request: MarketEventTemplateCreateRequest | MarketEventTemplateUpdateRequest;
    }
  | {
      valid: false;
      errors: Partial<Record<keyof MarketEventTemplateFormValues, string>>;
    };

export const marketEventTemplateCreateDefaults: MarketEventTemplateFormValues = {
  templateId: "",
  rarity: "",
  scope: "",
  automaticWeight: "0",
  automaticEnabled: false,
  blockingAllowed: false,
  minDurationSeconds: "",
  maxDurationSeconds: "",
  minEffectBasisPoints: "",
  maxEffectBasisPoints: "",
  effectDirection: "",
  cooldownSeconds: "",
  playerFacingName: "",
  playerFacingDescription: "",
  broadScopeHint: "",
  eligibleTargetMetadata: "",
};

export function toMarketEventTemplateFormValues(
  template: MarketEventTemplate,
): MarketEventTemplateFormValues {
  return {
    templateId: template.templateId,
    rarity: template.rarity,
    scope: template.scope,
    automaticWeight: String(template.automaticWeight),
    automaticEnabled: template.automaticEnabled,
    blockingAllowed: template.blockingAllowed,
    minDurationSeconds: String(template.minDurationSeconds),
    maxDurationSeconds: String(template.maxDurationSeconds),
    minEffectBasisPoints: String(template.minEffectBasisPoints),
    maxEffectBasisPoints: String(template.maxEffectBasisPoints),
    effectDirection: template.effectDirection,
    cooldownSeconds: String(template.cooldownSeconds),
    playerFacingName: template.playerFacingName,
    playerFacingDescription: template.playerFacingDescription,
    broadScopeHint: template.broadScopeHint,
    eligibleTargetMetadata: template.eligibleTargetMetadata,
  };
}

function requireText(
  values: MarketEventTemplateFormValues,
  key: keyof MarketEventTemplateFormValues,
  errors: Partial<Record<keyof MarketEventTemplateFormValues, string>>,
): string {
  const value = String(values[key]).trim();

  if (!value) {
    errors[key] = "This field is required.";
  }

  return value;
}

function parseInteger(
  values: MarketEventTemplateFormValues,
  key: keyof MarketEventTemplateFormValues,
  minimum: number,
  errors: Partial<Record<keyof MarketEventTemplateFormValues, string>>,
): number {
  const rawValue = String(values[key]).trim();
  const numericValue = Number(rawValue);

  if (!rawValue || !Number.isInteger(numericValue)) {
    errors[key] = "Enter a whole number.";
  } else if (numericValue < minimum) {
    errors[key] =
      minimum === 0 ? "Must be 0 or greater." : "Must be greater than 0.";
  }

  return numericValue;
}

export function validateMarketEventTemplateForm(
  values: MarketEventTemplateFormValues,
  options: { includeTemplateId?: boolean } = {},
): MarketEventTemplateValidationResult {
  const errors: Partial<Record<keyof MarketEventTemplateFormValues, string>> = {};
  const includeTemplateId = options.includeTemplateId ?? true;
  const templateId = includeTemplateId
    ? requireText(values, "templateId", errors)
    : String(values.templateId).trim();
  const effectDirection = requireText(values, "effectDirection", errors);
  const playerFacingName = requireText(values, "playerFacingName", errors);
  const playerFacingDescription = requireText(
    values,
    "playerFacingDescription",
    errors,
  );
  const broadScopeHint = requireText(values, "broadScopeHint", errors);
  const eligibleTargetMetadata = requireText(
    values,
    "eligibleTargetMetadata",
    errors,
  );

  if (!values.rarity) errors.rarity = "Select a rarity.";
  if (!values.scope) errors.scope = "Select a scope.";

  const automaticWeight = parseInteger(values, "automaticWeight", 0, errors);
  const minDurationSeconds = parseInteger(values, "minDurationSeconds", 1, errors);
  const maxDurationSeconds = parseInteger(values, "maxDurationSeconds", 1, errors);
  const minEffectBasisPoints = parseInteger(values, "minEffectBasisPoints", 1, errors);
  const maxEffectBasisPoints = parseInteger(values, "maxEffectBasisPoints", 1, errors);
  const cooldownSeconds = parseInteger(values, "cooldownSeconds", 1, errors);

  if (eligibleTargetMetadata) {
    try {
      JSON.parse(eligibleTargetMetadata);
    } catch {
      errors.eligibleTargetMetadata = "Enter valid JSON.";
    }
  }

  if (Object.keys(errors).length > 0 || !values.rarity || !values.scope) {
    return { valid: false, errors };
  }

  const authoredFields: MarketEventTemplateUpdateRequest = {
    rarity: values.rarity,
    scope: values.scope,
    automaticWeight,
    automaticEnabled: values.automaticEnabled,
    blockingAllowed: values.blockingAllowed,
    minDurationSeconds,
    maxDurationSeconds,
    minEffectBasisPoints,
    maxEffectBasisPoints,
    effectDirection,
    cooldownSeconds,
    playerFacingName,
    playerFacingDescription,
    broadScopeHint,
    eligibleTargetMetadata,
  };

  return {
    valid: true,
    request: includeTemplateId
      ? { templateId, ...authoredFields }
      : authoredFields,
  };
}
