import type { MarketEventTemplate } from "../../../../types/models/marketEventTemplate.types.js";

export function prependMarketEventTemplateRow(
  rows: MarketEventTemplate[],
  template: MarketEventTemplate,
): MarketEventTemplate[] {
  return [template, ...rows];
}

export function replaceMarketEventTemplateRow(
  rows: MarketEventTemplate[],
  template: MarketEventTemplate,
): MarketEventTemplate[] {
  return rows.map((row) =>
    row.templateId === template.templateId ? template : row,
  );
}
