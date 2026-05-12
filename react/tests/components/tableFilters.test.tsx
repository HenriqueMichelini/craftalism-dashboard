import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { TableFilters } from "../../src/components/ui/TableFilters.js";
import {
  resetDraftFilters,
  updateDraftFilterValue,
} from "../../src/components/ui/tableFilterState.js";
import type { TableFilterField } from "../../src/types/table.types.js";

const fields: TableFilterField[] = [
  {
    kind: "text",
    key: "playerUuid",
    label: "Player UUID",
  },
  {
    kind: "matchMode",
    key: "matchMode",
    label: "Text Match",
  },
  {
    kind: "enum",
    key: "type",
    label: "Type",
    options: [
      { label: "All", value: "" },
      { label: "Buy", value: "buy" },
      { label: "Sell", value: "sell" },
    ],
  },
  {
    kind: "numberRange",
    minKey: "minTotalPrice",
    maxKey: "maxTotalPrice",
    label: "Total Price",
  },
  {
    kind: "dateRange",
    fromKey: "createdFrom",
    toKey: "createdTo",
    label: "Created",
  },
];

test("TableFilters renders reusable filter controls with apply and reset actions", () => {
  const markup = renderToStaticMarkup(
    <TableFilters fields={fields} onApply={() => {}} onReset={() => {}} />,
  );

  assert.match(markup, /Player UUID/);
  assert.match(markup, /Text Match/);
  assert.match(markup, /Contains/);
  assert.match(markup, /Exact/);
  assert.match(markup, /All/);
  assert.match(markup, /Buy/);
  assert.match(markup, /Sell/);
  assert.match(markup, /Total Price/);
  assert.match(markup, /Created/);
  assert.match(markup, /Reset/);
  assert.match(markup, /Apply/);
});

test("updateDraftFilterValue changes draft state without applying active filters", () => {
  const activeFilters = {};
  const draft = updateDraftFilterValue(activeFilters, "playerUuid", "550e8400");

  assert.deepEqual(activeFilters, {});
  assert.deepEqual(draft, { playerUuid: "550e8400" });
});

test("resetDraftFilters clears draft criteria", () => {
  assert.deepEqual(resetDraftFilters(), {});
});
