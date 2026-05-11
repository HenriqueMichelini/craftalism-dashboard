import { test } from "node:test";
import * as assert from "node:assert/strict";
import {
  MARKET_TRADES_ENDPOINT,
  marketTradesApi,
} from "../../src/api/endpoints/marketTrades.js";
import { clearApiReadToken, setApiReadToken } from "../../src/api/auth.js";

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

test("marketTradesApi.getAll sends configured api read bearer token", async () => {
  const originalFetch = globalThis.fetch;
  let authorization: string | null = null;

  setApiReadToken("read-token");

  globalThis.fetch = ((_input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    authorization = headers.get("Authorization");

    return Promise.resolve(
      new Response(JSON.stringify({ content: [] }), {
        headers: { "content-type": "application/json" },
      }),
    );
  }) as typeof fetch;

  try {
    await marketTradesApi.getAll();
  } finally {
    clearApiReadToken();
    globalThis.fetch = originalFetch;
  }

  assert.equal(authorization, "Bearer read-token");
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
