import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import DashboardLayout from "../../src/layouts/DashboardLayout.js";

test("DashboardLayout keeps the navbar fixed-height while content scrolls", () => {
  const markup = renderToStaticMarkup(
    <DashboardLayout>
      <div>Dashboard content</div>
    </DashboardLayout>,
  );

  assert.match(markup, /h-16 shrink-0/);
  assert.match(markup, /flex min-h-0 flex-1/);
  assert.match(markup, /min-w-0 flex-1 .*overflow-auto/);
});
