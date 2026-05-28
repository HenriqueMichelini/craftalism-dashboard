import { test } from "node:test";
import * as assert from "node:assert/strict";
import {
  MARKET_EVENTS_ENDPOINT,
  marketEventsApi,
} from "../../src/api/endpoints/marketEvents.js";

test("MARKET_EVENTS_ENDPOINT uses canonical dashboard market events route", () => {
  assert.equal(MARKET_EVENTS_ENDPOINT, "/api/dashboard/market/events");
});

test("marketEventsApi.getAll fetches the canonical market events route", async () => {
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
    await marketEventsApi.getAll();
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(requestedUrls, ["/api/dashboard/market/events"]);
});

test("marketEventsApi.getAll maps API event rows while preserving order", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (() =>
    Promise.resolve(
      new Response(
        JSON.stringify([
          {
            id: 2,
            templateId: "rare-wheat-pressure",
            source: "SCHEDULER",
            rarity: "RARE",
            scope: "CATEGORY",
            selectedCategoryId: "farming",
            selectedItemIds: null,
            effectBasisPoints: 750,
            effectVersion: 3,
            blocking: false,
            startedAt: "2026-05-28T12:00:00Z",
            endsAt: "2026-05-28T13:00:00Z",
            status: "ACTIVE",
            endReason: null,
            actor: null,
            auditMetadata: null,
            createdAt: "2026-05-28T12:00:00Z",
            updatedAt: "2026-05-28T12:00:00Z",
          },
          {
            id: "1",
            templateId: "manual-diamond-block",
            source: "ADMIN",
            rarity: "EXTRA_RARE",
            scope: "ITEM",
            selectedCategoryId: null,
            selectedItemIds: "diamond",
            effectBasisPoints: -1000,
            effectVersion: 1,
            blocking: true,
            startedAt: "2026-05-27T12:00:00Z",
            endsAt: "2026-05-27T13:00:00Z",
            status: "CANCELLED",
            endReason: "CANCELLED",
            actor: "operator@example.com",
            auditMetadata: "{\"reason\":\"manual\"}",
            createdAt: "2026-05-27T12:00:00Z",
            updatedAt: "2026-05-27T12:30:00Z",
          },
        ]),
        {
          headers: { "content-type": "application/json" },
        },
      ),
    )) as typeof fetch;

  try {
    const events = await marketEventsApi.getAll();

    assert.deepEqual(
      events.map((event) => event.id),
      ["2", "1"],
    );
    assert.equal(events[0].templateId, "rare-wheat-pressure");
    assert.equal(events[0].effectBasisPoints, 750);
    assert.equal(events[1].actor, "operator@example.com");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
