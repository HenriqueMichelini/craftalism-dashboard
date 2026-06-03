import type { MarketEventTemplate } from "../../../../types/models/marketEventTemplate.types.js";
import type { TableConfig } from "../../../../types/table.types.js";
import { formatters } from "../../../../utils/formatters.js";

const monoCellClassName = "font-mono text-sm text-default";

function toReadableLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function renderAutomatic(
  _value: MarketEventTemplate[keyof MarketEventTemplate],
  row: MarketEventTemplate,
) {
  return row.automaticEnabled ? `Yes (${row.automaticWeight})` : `No (${row.automaticWeight})`;
}

function renderDurationRange(
  _value: MarketEventTemplate[keyof MarketEventTemplate],
  row: MarketEventTemplate,
) {
  return `${row.minDurationSeconds}-${row.maxDurationSeconds}s`;
}

function renderEffectRange(
  _value: MarketEventTemplate[keyof MarketEventTemplate],
  row: MarketEventTemplate,
) {
  return `${toReadableLabel(row.effectDirection)} ${row.minEffectBasisPoints}-${row.maxEffectBasisPoints} bp`;
}

export const marketEventTemplatesTableConfig: TableConfig<MarketEventTemplate> = {
  rowKey: "templateId",
  columns: [
    { key: "templateId", label: "Template ID", className: monoCellClassName },
    { key: "scope", label: "Scope", render: (value) => toReadableLabel(String(value)) },
    { key: "automaticEnabled", label: "Automatic", render: renderAutomatic },
    { key: "blockingAllowed", label: "Blocking Allowed", render: (value) => value ? "Yes" : "No" },
    { key: "minDurationSeconds", label: "Duration", render: renderDurationRange, className: monoCellClassName },
    { key: "effectDirection", label: "Effect", render: renderEffectRange, className: monoCellClassName },
    { key: "cooldownSeconds", label: "Cooldown", render: (value) => `${value}s`, className: monoCellClassName },
    { key: "playerFacingName", label: "Player Name" },
    { key: "broadScopeHint", label: "Scope Hint" },
    { key: "updatedAt", label: "Updated", render: (value) => formatters.date(String(value)), className: monoCellClassName },
  ],
};
