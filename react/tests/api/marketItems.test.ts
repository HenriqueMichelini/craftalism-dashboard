import { test } from "node:test";
import * as assert from "node:assert/strict";
import { ApiError } from "../../src/api/client.js";
import { marketItemsApi } from "../../src/api/endpoints/marketItems.js";
import type {
  MarketItem,
  MarketItemCreateRequest,
  MarketItemUpdateRequest,
} from "../../src/types/models/marketItem.types.js";

const marketItem: MarketItem = {
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

const createRequest: MarketItemCreateRequest = {
  itemId: marketItem.itemId,
  categoryId: marketItem.categoryId,
  categoryDisplayName: marketItem.categoryDisplayName,
  displayName: marketItem.displayName,
  iconKey: marketItem.iconKey,
  currency: marketItem.currency,
  blocked: marketItem.blocked,
  operating: marketItem.operating,
  baseUnitPrice: marketItem.baseUnitPrice,
  minUnitPrice: marketItem.minUnitPrice,
  maxUnitPrice: marketItem.maxUnitPrice,
  segmentSize: marketItem.segmentSize,
  priceSensitivity: marketItem.priceSensitivity,
  baseRegenQuantity: marketItem.baseRegenQuantity,
  regenIntervalSeconds: marketItem.regenIntervalSeconds,
  netPosition: marketItem.netPosition,
  minNetPosition: marketItem.minNetPosition,
  maxNetPosition: marketItem.maxNetPosition,
};

const updateRequest: MarketItemUpdateRequest = {
  categoryDisplayName: "Staple Crops",
  iconKey: "wheat-bundle",
  currency: "CRAFT",
  blocked: true,
  operating: false,
  baseUnitPrice: 110,
  minUnitPrice: 60,
  maxUnitPrice: 210,
  segmentSize: 40,
  priceSensitivity: 0.09,
  baseRegenQuantity: 2,
  regenIntervalSeconds: 90,
  netPosition: -10,
  minNetPosition: -100,
  maxNetPosition: 100,
};

test("marketItemsApi exposes the confirmed dashboard market item routes", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(input), init });

    return Promise.resolve(
      new Response(JSON.stringify(init?.method === "PATCH" ? { ...marketItem, ...updateRequest } : marketItem), {
        headers: { "content-type": "application/json" },
        status: init?.method === "POST" ? 201 : 200,
      }),
    );
  }) as typeof fetch;

  try {
    await marketItemsApi.getAll();
    await marketItemsApi.create(createRequest);
    await marketItemsApi.update(marketItem.itemId, updateRequest);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(requests[0]?.url, "/api/dashboard/market/items");
  assert.equal(requests[1]?.url, "/api/dashboard/market/items");
  assert.equal(requests[1]?.init?.method, "POST");
  assert.equal(requests[1]?.init?.body, JSON.stringify(createRequest));
  assert.equal(requests[2]?.url, "/api/dashboard/market/items/wheat");
  assert.equal(requests[2]?.init?.method, "PATCH");
  assert.equal(requests[2]?.init?.body, JSON.stringify(updateRequest));

  const createPayload = JSON.parse(String(requests[1]?.init?.body)) as Record<
    string,
    unknown
  >;
  const updatePayload = JSON.parse(String(requests[2]?.init?.body)) as Record<
    string,
    unknown
  >;

  ["lastUpdatedAt", "buyUnitEstimate", "sellUnitEstimate", "currentStock", "variationPercent", "marketMomentum"].forEach(
    (field) => {
      assert.equal(field in createPayload, false);
      assert.equal(field in updatePayload, false);
    },
  );
  ["itemId", "categoryId", "displayName"].forEach((field) => {
    assert.equal(field in updatePayload, false);
  });
});

test("marketItemsApi.delete uses DELETE and surfaces structured rejection messages", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(input), init });

    if (requests.length === 1) {
      return Promise.resolve(new Response(null, { status: 204 }));
    }

    return Promise.resolve(
      new Response(
        JSON.stringify({
          title: "Market item is in use",
          detail: "Market item wheat is referenced by trade history.",
        }),
        {
          headers: { "content-type": "application/problem+json" },
          status: 409,
          statusText: "Conflict",
        },
      ),
    );
  }) as typeof fetch;

  try {
    await marketItemsApi.delete("wheat");
    await assert.rejects(
      () => marketItemsApi.delete("wheat"),
      (error: unknown) =>
        error instanceof ApiError &&
        error.status === 409 &&
        error.message === "Market item wheat is referenced by trade history.",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(requests[0]?.url, "/api/dashboard/market/items/wheat");
  assert.equal(requests[0]?.init?.method, "DELETE");
  assert.equal(requests[1]?.url, "/api/dashboard/market/items/wheat");
  assert.equal(requests[1]?.init?.method, "DELETE");
});
