import { test } from "node:test";
import * as assert from "node:assert/strict";
import {
  getTransactionsEndpoint,
  TRANSACTIONS_ENDPOINT,
  transactionsApi,
} from "../../src/api/endpoints/transactions.js";

test("TRANSACTIONS_ENDPOINT uses canonical /api/transactions route", () => {
  assert.equal(TRANSACTIONS_ENDPOINT, "/api/transactions");
});

test("getTransactionsEndpoint builds canonical filtered transaction query", () => {
  assert.equal(
    getTransactionsEndpoint({
      fromPlayerUuid: "550e8400",
      toPlayerUuid: "550e8400-e29b-41d4-a716-446655440001",
      matchMode: "exact",
      minAmount: 100,
      maxAmount: "5000",
      createdFrom: "2026-05-01T00:00:00Z",
      createdTo: "2026-05-12T23:59:59Z",
    }),
    "/api/transactions?fromPlayerUuid=550e8400&fromPlayerUuidMatch=exact&toPlayerUuid=550e8400-e29b-41d4-a716-446655440001&toPlayerUuidMatch=exact&minAmount=100&maxAmount=5000&createdFrom=2026-05-01T00%3A00%3A00Z&createdTo=2026-05-12T23%3A59%3A59Z",
  );
});

test("getTransactionsEndpoint omits empty and reset filter values", () => {
  assert.equal(
    getTransactionsEndpoint({
      fromPlayerUuid: " ",
      toPlayerUuid: "",
      matchMode: "exact",
      minAmount: undefined,
      maxAmount: null,
    }),
    "/api/transactions",
  );
});

test("transactionsApi.getAll preserves unfiltered route behavior", async () => {
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
    await transactionsApi.getAll();
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(requestedUrls, ["/api/transactions"]);
});

test("transactionsApi.getAll sends filtered transaction requests", async () => {
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
    await transactionsApi.getAll({ fromPlayerUuid: "550e8400" });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(requestedUrls, [
    "/api/transactions?fromPlayerUuid=550e8400&fromPlayerUuidMatch=contains",
  ]);
});
