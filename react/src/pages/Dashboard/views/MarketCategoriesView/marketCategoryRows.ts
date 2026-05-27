import type { MarketCategory } from "../../../../types/models/marketCategory.types.js";

export function upsertMarketCategoryRow(
  categories: MarketCategory[],
  savedCategory: MarketCategory,
): MarketCategory[] {
  const existingIndex = categories.findIndex(
    (category) => category.categoryId === savedCategory.categoryId,
  );

  if (existingIndex === -1) {
    return [...categories, savedCategory].sort(compareMarketCategories);
  }

  return categories
    .map((category, index) =>
      index === existingIndex ? savedCategory : category,
    )
    .sort(compareMarketCategories);
}

export function removeMarketCategoryRow(
  categories: MarketCategory[],
  categoryId: string,
): MarketCategory[] {
  return categories.filter((category) => category.categoryId !== categoryId);
}

function compareMarketCategories(
  left: MarketCategory,
  right: MarketCategory,
) {
  if (left.displayOrder !== right.displayOrder) {
    return left.displayOrder - right.displayOrder;
  }
  return left.categoryId.localeCompare(right.categoryId);
}
