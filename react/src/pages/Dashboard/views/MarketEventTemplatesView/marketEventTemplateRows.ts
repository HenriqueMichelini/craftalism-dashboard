import type { MarketEventTemplate } from "../../../../types/models/marketEventTemplate.types.js";

export function prependMarketEventTemplateRow(
  rows: MarketEventTemplate[],
  template: MarketEventTemplate,
): MarketEventTemplate[] {
  return [template, ...rows];
}
