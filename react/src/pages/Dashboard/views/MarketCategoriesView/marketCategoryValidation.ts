import type {
  MarketCategoryCreateRequest,
  MarketCategoryUpdateRequest,
} from "../../../../types/models/marketCategory.types.js";

export type MarketCategoryFormValues = {
  categoryId: string;
  displayName: string;
  iconKey: string;
  displayOrder: string;
};

export type ValidMarketCategoryValues = {
  createRequest: MarketCategoryCreateRequest;
  updateRequest: MarketCategoryUpdateRequest;
};

export type MarketCategoryValidationResult =
  | { valid: true; values: ValidMarketCategoryValues }
  | {
      valid: false;
      errors: Partial<Record<keyof MarketCategoryFormValues, string>>;
    };

export const marketCategoryCreateDefaults: MarketCategoryFormValues = {
  categoryId: "",
  displayName: "",
  iconKey: "",
  displayOrder: "0",
};

export function validateMarketCategoryForm(
  values: MarketCategoryFormValues,
): MarketCategoryValidationResult {
  const errors: Partial<Record<keyof MarketCategoryFormValues, string>> = {};
  const categoryId = values.categoryId.trim();
  const displayName = values.displayName.trim();
  const iconKey = values.iconKey.trim();
  const displayOrder = Number(values.displayOrder.trim());

  if (!categoryId) errors.categoryId = "This field is required.";
  if (!displayName) errors.displayName = "This field is required.";
  if (!iconKey) errors.iconKey = "This field is required.";
  if (!values.displayOrder.trim()) {
    errors.displayOrder = "This field is required.";
  } else if (!Number.isInteger(displayOrder)) {
    errors.displayOrder = "Enter a whole number.";
  } else if (displayOrder < 0) {
    errors.displayOrder = "Must be greater than or equal to 0.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const updateRequest = { displayName, iconKey, displayOrder };
  return {
    valid: true,
    values: {
      createRequest: { categoryId, ...updateRequest },
      updateRequest,
    },
  };
}
