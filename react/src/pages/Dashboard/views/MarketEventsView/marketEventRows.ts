import type { MarketEvent } from "../../../../types/models/marketEvent.types.js";

export function upsertMarketEventRow(
  rows: MarketEvent[],
  event: MarketEvent,
): MarketEvent[] {
  const existingIndex = rows.findIndex((row) => row.id === event.id);

  if (existingIndex === -1) {
    return [event, ...rows];
  }

  return rows.map((row) => (row.id === event.id ? event : row));
}
