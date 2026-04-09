import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { DynamicTable } from "../../src/components/ui/Table/DynamicTable.js";
import type { TableConfig } from "../../src/types/table.types";

type TestRow = {
  id: string;
  name: string;
};

const tableConfig: TableConfig<TestRow> = {
  rowKey: "id",
  columns: [
    { key: "id", label: "Id" },
    { key: "name", label: "Name" },
  ],
};

test("DynamicTable renders loading state before data is available", () => {
  const markup = renderToStaticMarkup(
    <DynamicTable
      caption="Example table"
      config={tableConfig}
      data={[]}
      error={null}
      loading
    />,
  );

  assert.match(markup, /Loading data\.\.\./);
});

test("DynamicTable renders retryable error state for failed requests", () => {
  const markup = renderToStaticMarkup(
    <DynamicTable
      caption="Example table"
      config={tableConfig}
      data={[]}
      error="API unavailable"
      loading={false}
      onRetry={() => {}}
    />,
  );

  assert.match(markup, /Error: API unavailable/);
  assert.match(markup, /Retry/);
});

test("DynamicTable renders empty state when the request succeeds with no rows", () => {
  const markup = renderToStaticMarkup(
    <DynamicTable
      caption="Example table"
      config={tableConfig}
      data={[]}
      error={null}
      loading={false}
      emptyMessage="Nothing to display."
    />,
  );

  assert.match(markup, /Nothing to display\./);
});

test("DynamicTable renders rows when data is present", () => {
  const markup = renderToStaticMarkup(
    <DynamicTable
      caption="Example table"
      config={tableConfig}
      data={[{ id: "row-1", name: "Alex" }]}
      error={null}
      loading={false}
    />,
  );

  assert.match(markup, /Example table/);
  assert.match(markup, /Alex/);
  assert.match(markup, /row-1/);
});
