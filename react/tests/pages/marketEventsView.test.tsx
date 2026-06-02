import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketEventsView } from "../../src/pages/Dashboard/views/MarketEventsView/MarketEventsView.js";

test("MarketEventsView keeps create unavailable while reference rows load", () => {
  const markup = renderToStaticMarkup(<MarketEventsView />);

  assert.match(markup, /Add Market Event/);
  assert.match(markup, /disabled=""/);
  assert.match(markup, /Loading data\.\.\./);
});
