import { test } from "node:test";
import * as assert from "node:assert/strict";
import { marketCategoriesApi } from "../../src/api/endpoints/marketCategories.js";
import type {
  MarketCategory,
  MarketCategoryCreateRequest,
  MarketCategoryUpdateRequest,
} from "../../src/types/models/marketCategory.types.js";

const marketCategory: MarketCategory = {
  categoryId: "crops",
  displayName: "Crops",
  iconKey: "WHEAT",
  displayOrder: 0,
  createdAt: "2026-05-01T00:00:00.000Z",
  updatedAt: "2026-05-01T00:00:00.000Z",
};

const createRequest: MarketCategoryCreateRequest = {
  categoryId: "crops",
  displayName: "Crops",
  iconKey: "WHEAT",
  displayOrder: 0,
};

const updateRequest: MarketCategoryUpdateRequest = {
  displayName: "Staple Crops",
  iconKey: "HAY_BLOCK",
  displayOrder: 1,
};

test("marketCategoriesApi exposes dashboard market category CRUD routes", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(input), init });

    return Promise.resolve(
      new Response(
        init?.method === "DELETE" ? null : JSON.stringify(marketCategory),
        {
          headers: { "content-type": "application/json" },
          status: init?.method === "POST" ? 201 : init?.method === "DELETE" ? 204 : 200,
        },
      ),
    );
  }) as typeof fetch;

  try {
    await marketCategoriesApi.getAll();
    await marketCategoriesApi.create(createRequest);
    await marketCategoriesApi.update("crops", updateRequest);
    await marketCategoriesApi.delete("crops");
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(requests[0]?.url, "/api/dashboard/market/categories");
  assert.equal(requests[1]?.url, "/api/dashboard/market/categories");
  assert.equal(requests[1]?.init?.method, "POST");
  assert.equal(requests[1]?.init?.body, JSON.stringify(createRequest));
  assert.equal(requests[2]?.url, "/api/dashboard/market/categories/crops");
  assert.equal(requests[2]?.init?.method, "PATCH");
  assert.equal(requests[2]?.init?.body, JSON.stringify(updateRequest));
  assert.equal(requests[3]?.url, "/api/dashboard/market/categories/crops");
  assert.equal(requests[3]?.init?.method, "DELETE");
});
