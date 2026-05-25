import type { MarketItem } from "../../../../types/models/marketItem.types.js";

export function upsertMarketItemRow(
  rows: MarketItem[],
  item: MarketItem,
): MarketItem[] {
  const existingIndex = rows.findIndex((row) => row.itemId === item.itemId);

  if (existingIndex === -1) {
    return [...rows, item];
  }

  return rows.map((row) => (row.itemId === item.itemId ? item : row));
}

export function removeMarketItemRow(
  rows: MarketItem[],
  itemId: string,
): MarketItem[] {
  return rows.filter((row) => row.itemId !== itemId);
}
