import { test } from "node:test";
import * as assert from "node:assert/strict";
import {
  getMarketTradesEndpoint,
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
      new Response(JSON.stringify({ content: [] }), {
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

test("getMarketTradesEndpoint builds canonical filtered market trade query", () => {
  assert.equal(
    getMarketTradesEndpoint({
      type: "buy",
      playerUuid: "550e8400",
      itemId: "wheat",
      matchMode: "exact",
      minTotalPrice: 1000,
      maxTotalPrice: "50000",
      createdFrom: "2026-05-01T00:00:00Z",
      createdTo: "2026-05-12T23:59:59Z",
    }),
    "/api/market/trades?side=BUY&playerUuid=550e8400&playerUuidMatch=exact&itemId=wheat&itemIdMatch=exact&minTotalPrice=1000&maxTotalPrice=50000&executedFrom=2026-05-01T00%3A00%3A00Z&executedTo=2026-05-12T23%3A59%3A59Z",
  );
});

test("getMarketTradesEndpoint omits empty and reset filter values", () => {
  assert.equal(
    getMarketTradesEndpoint({
      playerUuid: " ",
      itemId: "",
      matchMode: "exact",
      minTotalPrice: undefined,
      maxTotalPrice: null,
    }),
    "/api/market/trades",
  );
});

test("marketTradesApi.getAll sends filtered market trade requests", async () => {
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = ((input: RequestInfo | URL) => {
    requestedUrls.push(String(input));

    return Promise.resolve(
      new Response(JSON.stringify({ content: [] }), {
        headers: { "content-type": "application/json" },
      }),
    );
  }) as typeof fetch;

  try {
    await marketTradesApi.getAll({ type: "sell", itemId: "diamond" });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(requestedUrls, [
    "/api/market/trades?side=SELL&itemId=diamond&itemIdMatch=contains",
  ]);
});

test("marketTradesApi.getAll maps API trade history page into table rows", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          content: [
            {
              id: 123,
              playerUuid: "220e8400-e29b-41d4-a716-446655440000",
              itemId: "wheat",
              side: "BUY",
              quantity: 32,
              unitPrice: "50000",
              totalPrice: "1600000",
              executedAt: "2026-04-12T18:31:05Z",
            },
          ],
        }),
        {
          headers: { "content-type": "application/json" },
        },
      ),
    )) as typeof fetch;

  try {
    const trades = await marketTradesApi.getAll();

    assert.deepEqual(trades, [
      {
        id: "123",
        type: "buy",
        playerUuid: "220e8400-e29b-41d4-a716-446655440000",
        itemId: "wheat",
        quantity: 32,
        unitPrice: 50000,
        totalPrice: 1600000,
        createdAt: "2026-04-12T18:31:05Z",
      },
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
