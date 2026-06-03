import { test } from "node:test";
import * as assert from "node:assert/strict";
import {
  MARKET_EVENT_TEMPLATES_ENDPOINT,
  marketEventTemplatesApi,
} from "../../src/api/endpoints/marketEventTemplates.js";
import type {
  MarketEventTemplate,
  MarketEventTemplateCreateRequest,
  MarketEventTemplateUpdateRequest,
} from "../../src/types/models/marketEventTemplate.types.js";

const createRequest: MarketEventTemplateCreateRequest = {
  templateId: "rare-wheat-pressure",
  rarity: "RARE",
  scope: "CATEGORY",
  automaticWeight: 4,
  automaticEnabled: true,
  blockingAllowed: false,
  minDurationSeconds: 300,
  maxDurationSeconds: 900,
  minEffectBasisPoints: 250,
  maxEffectBasisPoints: 750,
  effectDirection: "UP",
  cooldownSeconds: 1800,
  playerFacingName: "Wheat Pressure",
  playerFacingDescription: "Wheat prices are temporarily elevated.",
  broadScopeHint: "Farming category",
  eligibleTargetMetadata: '{"categoryIds":["farming"]}',
};

const updateRequest: MarketEventTemplateUpdateRequest = {
  rarity: "RARE",
  scope: "CATEGORY",
  automaticWeight: 6,
  automaticEnabled: true,
  blockingAllowed: false,
  minDurationSeconds: 600,
  maxDurationSeconds: 1200,
  minEffectBasisPoints: 10250,
  maxEffectBasisPoints: 10750,
  effectDirection: "UP",
  cooldownSeconds: 2400,
  playerFacingName: "Wheat Pressure",
  playerFacingDescription: "Wheat prices are temporarily elevated.",
  broadScopeHint: "Farming category",
  eligibleTargetMetadata: '{"categoryIds":["farming"]}',
};

const firstTemplate: MarketEventTemplate = {
  ...createRequest,
  createdAt: "2026-05-31T12:00:00Z",
  updatedAt: "2026-05-31T12:00:00Z",
};

const secondTemplate: MarketEventTemplate = {
  ...createRequest,
  templateId: "market-wide-surge",
  scope: "MARKET_WIDE",
  eligibleTargetMetadata: "{}",
  createdAt: "2026-05-30T12:00:00Z",
  updatedAt: "2026-05-30T12:00:00Z",
};

test("MARKET_EVENT_TEMPLATES_ENDPOINT uses the canonical dashboard route", () => {
  assert.equal(
    MARKET_EVENT_TEMPLATES_ENDPOINT,
    "/api/dashboard/market/event-templates",
  );
});

test("marketEventTemplatesApi preserves list order and posts authored templates", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(input), init });

    return Promise.resolve(
      new Response(
        JSON.stringify(
          init?.method === "POST"
            ? firstTemplate
            : [firstTemplate, secondTemplate],
        ),
        {
          headers: { "content-type": "application/json" },
          status: init?.method === "POST" ? 201 : 200,
        },
      ),
    );
  }) as typeof fetch;

  try {
    assert.deepEqual(
      (await marketEventTemplatesApi.getAll()).map(({ templateId }) => templateId),
      ["rare-wheat-pressure", "market-wide-surge"],
    );
    assert.deepEqual(
      await marketEventTemplatesApi.create(createRequest),
      firstTemplate,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(requests, [
    {
      url: "/api/dashboard/market/event-templates",
      init: { headers: { "Content-Type": "application/json" } },
    },
    {
      url: "/api/dashboard/market/event-templates",
      init: {
        method: "POST",
        body: JSON.stringify(createRequest),
        headers: { "Content-Type": "application/json" },
      },
    },
  ]);
});

test("marketEventTemplatesApi updates authored templates through the confirmed route", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const updatedTemplate: MarketEventTemplate = {
    ...firstTemplate,
    ...updateRequest,
    updatedAt: "2026-06-01T12:00:00Z",
  };

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(input), init });

    return Promise.resolve(
      new Response(JSON.stringify(updatedTemplate), {
        headers: { "content-type": "application/json" },
        status: 200,
      }),
    );
  }) as typeof fetch;

  try {
    assert.deepEqual(
      await marketEventTemplatesApi.update(
        "rare wheat/pressure",
        updateRequest,
      ),
      updatedTemplate,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(requests, [
    {
      url: "/api/dashboard/market/event-templates/rare%20wheat%2Fpressure",
      init: {
        method: "PUT",
        body: JSON.stringify(updateRequest),
        headers: { "Content-Type": "application/json" },
      },
    },
  ]);
});

test("marketEventTemplatesApi does not expose speculative delete behavior", () => {
  assert.equal("delete" in marketEventTemplatesApi, false);
});
