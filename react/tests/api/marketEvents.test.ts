import { test } from "node:test";
import * as assert from "node:assert/strict";
import {
  MARKET_EVENTS_ENDPOINT,
  marketEventsApi,
} from "../../src/api/endpoints/marketEvents.js";
import type {
  MarketEventCancelRequest,
  MarketEventCreateRequest,
  MarketEventUpdateRequest,
} from "../../src/types/models/marketEvent.types.js";

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

test("marketEventsApi exposes normalized admin mutation routes", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const createRequest: MarketEventCreateRequest = {
    templateId: "manual-diamond-block",
    scope: "ITEM",
    selectedItemIds: "diamond",
    effectBasisPoints: -1000,
    blocking: true,
    durationSeconds: 600,
    reason: "Manual incident response",
  };
  const updateRequest: MarketEventUpdateRequest = {
    blocking: false,
    endsAt: "2026-05-28T14:00:00Z",
    reason: "Resume trading",
  };
  const cancelRequest: MarketEventCancelRequest = {
    reason: "Operator cancelled",
  };

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(input), init });

    return Promise.resolve(
      new Response(
        JSON.stringify({
          id: 42,
          templateId: createRequest.templateId,
          source: "ADMIN",
          scope: createRequest.scope,
          selectedCategoryId: null,
          selectedItemIds: createRequest.selectedItemIds,
          effectBasisPoints: createRequest.effectBasisPoints,
          effectVersion: 1,
          blocking: createRequest.blocking,
          startedAt: "2026-05-28T12:00:00Z",
          endsAt: "2026-05-28T13:00:00Z",
          status: "ACTIVE",
          endReason: null,
          actor: "operator@example.com",
          auditMetadata: null,
          createdAt: "2026-05-28T12:00:00Z",
          updatedAt: "2026-05-28T12:00:00Z",
        }),
        {
          headers: { "content-type": "application/json" },
          status: init?.method === "POST" ? 201 : 200,
        },
      ),
    );
  }) as typeof fetch;

  try {
    assert.equal((await marketEventsApi.create(createRequest)).id, "42");
    assert.equal(
      (await marketEventsApi.update("event/id", updateRequest)).id,
      "42",
    );
    assert.equal(
      (await marketEventsApi.cancel("event/id", cancelRequest)).id,
      "42",
    );
    assert.equal((await marketEventsApi.supersede(createRequest)).id, "42");
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(
    requests.map(({ url, init }) => ({
      url,
      method: init?.method,
      body: init?.body,
    })),
    [
      {
        url: "/api/dashboard/market/events",
        method: "POST",
        body: JSON.stringify(createRequest),
      },
      {
        url: "/api/dashboard/market/events/event%2Fid",
        method: "PATCH",
        body: JSON.stringify(updateRequest),
      },
      {
        url: "/api/dashboard/market/events/event%2Fid/cancel",
        method: "POST",
        body: JSON.stringify(cancelRequest),
      },
      {
        url: "/api/dashboard/market/events/supersede",
        method: "POST",
        body: JSON.stringify(createRequest),
      },
    ],
  );
});
