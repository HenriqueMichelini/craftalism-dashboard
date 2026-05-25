import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketItemModalForm } from "../../src/pages/Dashboard/views/MarketItemsView/components/MarketItemModalForm.js";
import { MarketItemTable } from "../../src/pages/Dashboard/views/MarketItemsView/components/MarketItemTable.js";
import {
  marketItemCreateDefaults,
  validateMarketItemForm,
} from "../../src/pages/Dashboard/views/MarketItemsView/marketItemValidation.js";
import {
  removeMarketItemRow,
  upsertMarketItemRow,
} from "../../src/pages/Dashboard/views/MarketItemsView/marketItemRows.js";
import type { MarketItem } from "../../src/types/models/marketItem.types.js";

const item: MarketItem = {
  itemId: "wheat",
  categoryId: "crops",
  categoryDisplayName: "Crops",
  displayName: "Wheat",
  iconKey: "wheat",
  buyUnitEstimate: 120,
  sellUnitEstimate: 100,
  currency: "CRAFT",
  currentStock: 500,
  variationPercent: 1.25,
  blocked: false,
  operating: true,
  lastUpdatedAt: "2026-05-01T00:00:00.000Z",
  marketMomentum: 0,
  baseUnitPrice: 100,
  minUnitPrice: 50,
  maxUnitPrice: 200,
  segmentSize: 50,
  priceSensitivity: 0.08,
  baseRegenQuantity: 1,
  regenIntervalSeconds: 60,
  netPosition: 0,
  minNetPosition: null,
  maxNetPosition: null,
};

test("MarketItemModalForm renders grouped create defaults and edit read-only identity", () => {
  const createMarkup = renderToStaticMarkup(
    <MarketItemModalForm
      mode="create"
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );
  const editMarkup = renderToStaticMarkup(
    <MarketItemModalForm
      mode="edit"
      item={item}
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(createMarkup, /Create Market Item/);
  assert.match(createMarkup, /Identity/);
  assert.match(createMarkup, /Pricing/);
  assert.match(createMarkup, /Stock &amp; Position/);
  assert.match(createMarkup, /Regeneration/);
  assert.match(createMarkup, /State/);
  assert.match(createMarkup, /name="baseUnitPrice"[^>]*value="1"/);
  assert.match(createMarkup, /name="segmentSize"[^>]*value="50"/);
  assert.match(createMarkup, /name="priceSensitivity"[^>]*value="0\.0800"/);
  assert.doesNotMatch(createMarkup, /Remove/);

  assert.match(editMarkup, /Edit Market Item/);
  assert.match(editMarkup, /Remove/);
  assert.match(editMarkup, /readOnly=""[^>]*name="itemId"/);
  assert.match(editMarkup, /readOnly=""[^>]*name="categoryId"/);
  assert.match(editMarkup, /readOnly=""[^>]*name="displayName"/);
  assert.match(editMarkup, /value="wheat"/);
});

test("MarketItemTable renders the scan-friendly admin columns in order", () => {
  const markup = renderToStaticMarkup(
    <MarketItemTable
      data={[item]}
      loading={false}
      error={null}
      onRetry={() => {}}
      onMarketItemClick={() => {}}
    />,
  );
  const columnLabels = [
    "Item",
    "Category",
    "Buy Estimate",
    "Sell Estimate",
    "Currency",
    "Stock",
    "Variation %",
    "Blocked",
    "Operating",
    "Last Updated",
  ];
  let previousIndex = -1;

  columnLabels.forEach((label) => {
    const nextIndex = markup.indexOf(label);
    assert.ok(nextIndex > previousIndex, `${label} should be in column order`);
    previousIndex = nextIndex;
  });
  assert.match(markup, /No/);
  assert.match(markup, /Yes/);
});

test("validateMarketItemForm blocks dashboard constraint failures", () => {
  const result = validateMarketItemForm({
    ...marketItemCreateDefaults,
    itemId: "wheat",
    categoryId: "crops",
    categoryDisplayName: "Crops",
    displayName: "Wheat",
    iconKey: "wheat",
    currency: "CRAFT",
    baseUnitPrice: "0",
    minUnitPrice: "2",
    maxUnitPrice: "-1",
    segmentSize: "0",
    priceSensitivity: "0",
    baseRegenQuantity: "-1",
    regenIntervalSeconds: "0",
    minNetPosition: "1",
    maxNetPosition: "-1",
  });

  assert.equal(result.valid, false);
  assert.equal(
    result.valid ? undefined : result.errors.baseUnitPrice,
    "Must be greater than 0.",
  );
  assert.equal(
    result.valid ? undefined : result.errors.minUnitPrice,
    "Must be less than or equal to base unit price.",
  );
  assert.equal(
    result.valid ? undefined : result.errors.maxUnitPrice,
    "Must be greater than or equal to base unit price.",
  );
  assert.equal(
    result.valid ? undefined : result.errors.segmentSize,
    "Must be greater than 0.",
  );
  assert.equal(
    result.valid ? undefined : result.errors.priceSensitivity,
    "Must be greater than 0.",
  );
  assert.equal(
    result.valid ? undefined : result.errors.baseRegenQuantity,
    "Must be greater than or equal to 0.",
  );
  assert.equal(
    result.valid ? undefined : result.errors.regenIntervalSeconds,
    "Must be greater than 0.",
  );
  assert.equal(
    result.valid ? undefined : result.errors.minNetPosition,
    "Must be less than or equal to 0.",
  );
  assert.equal(
    result.valid ? undefined : result.errors.maxNetPosition,
    "Must be greater than or equal to 0.",
  );
});

test("validateMarketItemForm emits create and update payloads without projection fields", () => {
  const result = validateMarketItemForm({
    ...marketItemCreateDefaults,
    itemId: "wheat",
    categoryId: "crops",
    categoryDisplayName: "Crops",
    displayName: "Wheat",
    iconKey: "wheat",
    currency: "CRAFT",
    minNetPosition: "-100",
    maxNetPosition: "100",
  });

  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.deepEqual(result.values.createRequest, {
    itemId: "wheat",
    categoryId: "crops",
    categoryDisplayName: "Crops",
    displayName: "Wheat",
    iconKey: "wheat",
    currency: "CRAFT",
    blocked: false,
    operating: true,
    baseUnitPrice: 1,
    minUnitPrice: 1,
    maxUnitPrice: 1,
    segmentSize: 50,
    priceSensitivity: 0.08,
    baseRegenQuantity: 1,
    regenIntervalSeconds: 60,
    netPosition: 0,
    minNetPosition: -100,
    maxNetPosition: 100,
  });
  assert.equal("itemId" in result.values.updateRequest, false);
  assert.equal("categoryId" in result.values.updateRequest, false);
  assert.equal("displayName" in result.values.updateRequest, false);
  assert.equal("lastUpdatedAt" in result.values.createRequest, false);
});

test("market item row helpers preserve order on update and remove only after success", () => {
  const otherItem = { ...item, itemId: "stone", displayName: "Stone" };
  const updatedItem = { ...item, categoryDisplayName: "Staple Crops" };
  const rows = [item, otherItem];

  assert.deepEqual(upsertMarketItemRow(rows, updatedItem), [
    updatedItem,
    otherItem,
  ]);
  assert.deepEqual(removeMarketItemRow(rows, "wheat"), [otherItem]);
  assert.deepEqual(removeMarketItemRow(rows, "missing"), rows);
});
