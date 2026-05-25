import type {
  MarketItemCreateRequest,
  MarketItemUpdateRequest,
} from "../../../../types/models/marketItem.types.js";

export type MarketItemFormValues = {
  itemId: string;
  categoryId: string;
  categoryDisplayName: string;
  displayName: string;
  iconKey: string;
  currency: string;
  blocked: boolean;
  operating: boolean;
  baseUnitPrice: string;
  minUnitPrice: string;
  maxUnitPrice: string;
  segmentSize: string;
  priceSensitivity: string;
  baseRegenQuantity: string;
  regenIntervalSeconds: string;
  netPosition: string;
  minNetPosition: string;
  maxNetPosition: string;
};

export type ValidMarketItemValues = {
  createRequest: MarketItemCreateRequest;
  updateRequest: MarketItemUpdateRequest;
};

export type MarketItemValidationResult =
  | { valid: true; values: ValidMarketItemValues }
  | {
      valid: false;
      errors: Partial<Record<keyof MarketItemFormValues, string>>;
    };

export const marketItemCreateDefaults: MarketItemFormValues = {
  itemId: "",
  categoryId: "",
  categoryDisplayName: "",
  displayName: "",
  iconKey: "",
  currency: "",
  blocked: false,
  operating: true,
  baseUnitPrice: "1",
  minUnitPrice: "1",
  maxUnitPrice: "1",
  segmentSize: "50",
  priceSensitivity: "0.0800",
  baseRegenQuantity: "1",
  regenIntervalSeconds: "60",
  netPosition: "0",
  minNetPosition: "",
  maxNetPosition: "",
};

const requiredTextFields: Array<keyof MarketItemFormValues> = [
  "itemId",
  "categoryId",
  "categoryDisplayName",
  "displayName",
  "iconKey",
  "currency",
];

const integerFields: Array<keyof MarketItemFormValues> = [
  "baseUnitPrice",
  "minUnitPrice",
  "maxUnitPrice",
  "segmentSize",
  "baseRegenQuantity",
  "regenIntervalSeconds",
  "netPosition",
];

function parseNumber(
  values: MarketItemFormValues,
  key: keyof MarketItemFormValues,
  errors: Partial<Record<keyof MarketItemFormValues, string>>,
): number | null {
  const rawValue = String(values[key]).trim();

  if (!rawValue) {
    errors[key] = "This field is required.";
    return null;
  }

  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    errors[key] = "Enter a valid number.";
    return null;
  }

  if (integerFields.includes(key) && !Number.isInteger(numericValue)) {
    errors[key] = "Enter a whole number.";
    return null;
  }

  return numericValue;
}

function parseOptionalInteger(
  values: MarketItemFormValues,
  key: "minNetPosition" | "maxNetPosition",
  errors: Partial<Record<keyof MarketItemFormValues, string>>,
): number | null {
  const rawValue = values[key].trim();

  if (!rawValue) {
    return null;
  }

  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue) || !Number.isInteger(numericValue)) {
    errors[key] = "Enter a whole number.";
    return null;
  }

  return numericValue;
}

function assignConstraintError(
  errors: Partial<Record<keyof MarketItemFormValues, string>>,
  key: keyof MarketItemFormValues,
  message: string,
) {
  if (!errors[key]) {
    errors[key] = message;
  }
}

export function validateMarketItemForm(
  values: MarketItemFormValues,
): MarketItemValidationResult {
  const errors: Partial<Record<keyof MarketItemFormValues, string>> = {};
  const trimmed = {
    itemId: values.itemId.trim(),
    categoryId: values.categoryId.trim(),
    categoryDisplayName: values.categoryDisplayName.trim(),
    displayName: values.displayName.trim(),
    iconKey: values.iconKey.trim(),
    currency: values.currency.trim(),
  };

  requiredTextFields.forEach((field) => {
    if (!String(values[field]).trim()) {
      errors[field] = "This field is required.";
    }
  });

  const baseUnitPrice = parseNumber(values, "baseUnitPrice", errors);
  const minUnitPrice = parseNumber(values, "minUnitPrice", errors);
  const maxUnitPrice = parseNumber(values, "maxUnitPrice", errors);
  const segmentSize = parseNumber(values, "segmentSize", errors);
  const priceSensitivity = parseNumber(values, "priceSensitivity", errors);
  const baseRegenQuantity = parseNumber(values, "baseRegenQuantity", errors);
  const regenIntervalSeconds = parseNumber(
    values,
    "regenIntervalSeconds",
    errors,
  );
  const netPosition = parseNumber(values, "netPosition", errors);
  const minNetPosition = parseOptionalInteger(
    values,
    "minNetPosition",
    errors,
  );
  const maxNetPosition = parseOptionalInteger(
    values,
    "maxNetPosition",
    errors,
  );

  if (baseUnitPrice !== null && baseUnitPrice <= 0) {
    assignConstraintError(errors, "baseUnitPrice", "Must be greater than 0.");
  }
  if (minUnitPrice !== null && minUnitPrice <= 0) {
    assignConstraintError(errors, "minUnitPrice", "Must be greater than 0.");
  }
  if (
    minUnitPrice !== null &&
    baseUnitPrice !== null &&
    minUnitPrice > baseUnitPrice
  ) {
    assignConstraintError(
      errors,
      "minUnitPrice",
      "Must be less than or equal to base unit price.",
    );
  }
  if (
    maxUnitPrice !== null &&
    baseUnitPrice !== null &&
    maxUnitPrice < baseUnitPrice
  ) {
    assignConstraintError(
      errors,
      "maxUnitPrice",
      "Must be greater than or equal to base unit price.",
    );
  }
  if (segmentSize !== null && segmentSize <= 0) {
    assignConstraintError(errors, "segmentSize", "Must be greater than 0.");
  }
  if (priceSensitivity !== null && priceSensitivity <= 0) {
    assignConstraintError(
      errors,
      "priceSensitivity",
      "Must be greater than 0.",
    );
  }
  if (baseRegenQuantity !== null && baseRegenQuantity < 0) {
    assignConstraintError(
      errors,
      "baseRegenQuantity",
      "Must be greater than or equal to 0.",
    );
  }
  if (regenIntervalSeconds !== null && regenIntervalSeconds <= 0) {
    assignConstraintError(
      errors,
      "regenIntervalSeconds",
      "Must be greater than 0.",
    );
  }
  if (minNetPosition !== null && minNetPosition > 0) {
    assignConstraintError(
      errors,
      "minNetPosition",
      "Must be less than or equal to 0.",
    );
  }
  if (maxNetPosition !== null && maxNetPosition < 0) {
    assignConstraintError(
      errors,
      "maxNetPosition",
      "Must be greater than or equal to 0.",
    );
  }
  if (
    minNetPosition !== null &&
    maxNetPosition !== null &&
    minNetPosition > maxNetPosition
  ) {
    assignConstraintError(
      errors,
      "minNetPosition",
      "Must be less than or equal to max net position.",
    );
  }

  if (
    Object.keys(errors).length > 0 ||
    baseUnitPrice === null ||
    minUnitPrice === null ||
    maxUnitPrice === null ||
    segmentSize === null ||
    priceSensitivity === null ||
    baseRegenQuantity === null ||
    regenIntervalSeconds === null ||
    netPosition === null
  ) {
    return { valid: false, errors };
  }

  const updateRequest: MarketItemUpdateRequest = {
    categoryDisplayName: trimmed.categoryDisplayName,
    iconKey: trimmed.iconKey,
    currency: trimmed.currency,
    blocked: values.blocked,
    operating: values.operating,
    baseUnitPrice,
    minUnitPrice,
    maxUnitPrice,
    segmentSize,
    priceSensitivity,
    baseRegenQuantity,
    regenIntervalSeconds,
    netPosition,
    minNetPosition,
    maxNetPosition,
  };

  return {
    valid: true,
    values: {
      createRequest: {
        itemId: trimmed.itemId,
        categoryId: trimmed.categoryId,
        displayName: trimmed.displayName,
        ...updateRequest,
      },
      updateRequest,
    },
  };
}
