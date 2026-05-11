import { test } from "node:test";
import * as assert from "node:assert/strict";
import {
  MARKET_TRADES_ENDPOINT,
  marketTradesApi,
} from "../../src/api/endpoints/marketTrades.js";

test("MARKET_TRADES_ENDPOINT uses canonical /api/market/trades route", () => {
  assert.equal(MARKET_TRADES_ENDPOINT, "/api/market/trades");
});

test("marketTradesApi.getAll fetches the canonical market trades route", async () => {
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = ((input: RequestInfo | URL) => {
    requestedUrls.push(String(input));

    return Promise.resolve(
      new Response(JSON.stringify([]), {
        headers: { "content-type": "application/json" },
      }),
    );
  }) as typeof fetch;

  try {
    await marketTradesApi.getAll();
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(requestedUrls, ["/api/market/trades"]);
});
