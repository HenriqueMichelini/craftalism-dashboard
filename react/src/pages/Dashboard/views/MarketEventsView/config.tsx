import type { TableConfig } from "../../../../types/table.types.js";
import type { MarketEvent } from "../../../../types/models/marketEvent.types.js";
import { formatters } from "../../../../utils/formatters.js";

const monoCellClassName = "font-mono text-sm text-default";
const mutedCellClassName = "text-muted";

function toReadableLabel(value: string | null): string {
  if (!value) {
    return "-";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function renderOptionalMono(value: MarketEvent[keyof MarketEvent]) {
  if (value === null || value === undefined || value === "") {
    return <span className={mutedCellClassName}>-</span>;
  }

  return <span className={monoCellClassName}>{String(value)}</span>;
}

function renderTargets(_value: MarketEvent[keyof MarketEvent], row: MarketEvent) {
  if (row.selectedCategoryId) {
    return <span className={monoCellClassName}>{row.selectedCategoryId}</span>;
  }

  if (row.selectedItemIds) {
    return <span className={monoCellClassName}>{row.selectedItemIds}</span>;
  }

  return <span className={mutedCellClassName}>-</span>;
}

function renderEffect(value: MarketEvent[keyof MarketEvent]) {
  const basisPoints = Number(value);
  const percent = basisPoints / 100;
  const sign = basisPoints > 0 ? "+" : "";

  return (
    <span className={monoCellClassName}>
      {sign}
      {basisPoints} bp ({sign}
      {percent.toFixed(2)}%)
    </span>
  );
}

function renderBoolean(value: MarketEvent[keyof MarketEvent]) {
  return value ? "Yes" : "No";
}

export const marketEventsTableConfig: TableConfig<MarketEvent> = {
  columns: [
    {
      key: "id",
      label: "Id",
      className: monoCellClassName,
    },
    {
      key: "templateId",
      label: "Template",
      className: monoCellClassName,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => toReadableLabel(value as string),
    },
    {
      key: "scope",
      label: "Scope",
      render: (value) => toReadableLabel(value as string),
    },
    {
      key: "selectedItemIds",
      label: "Targets",
      render: renderTargets,
    },
    {
      key: "effectBasisPoints",
      label: "Effect",
      render: renderEffect,
    },
    {
      key: "blocking",
      label: "Blocking",
      render: renderBoolean,
    },
    {
      key: "source",
      label: "Source",
      render: (value) => toReadableLabel(value as string),
    },
    {
      key: "startedAt",
      label: "Started",
      render: (value) => formatters.date(value as string),
      className: monoCellClassName,
    },
    {
      key: "endsAt",
      label: "Ends",
      render: (value) => formatters.date(value as string),
      className: monoCellClassName,
    },
    {
      key: "endReason",
      label: "End Reason",
      render: (value) => toReadableLabel(value as string | null),
    },
    {
      key: "actor",
      label: "Actor",
      render: renderOptionalMono,
    },
  ],
  rowKey: "id",
};
