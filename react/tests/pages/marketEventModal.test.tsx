import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketEventModalForm } from "../../src/pages/Dashboard/views/MarketEventsView/components/MarketEventModalForm.js";
import { submitMarketEventSave } from "../../src/pages/Dashboard/views/MarketEventsView/marketEventActions.js";
import { toDateTimeLocal } from "../../src/pages/Dashboard/views/MarketEventsView/marketEventDateTime.js";
import { upsertMarketEventRow } from "../../src/pages/Dashboard/views/MarketEventsView/marketEventRows.js";
import {
  marketEventCreateDefaults,
  validateMarketEventForm,
} from "../../src/pages/Dashboard/views/MarketEventsView/marketEventValidation.js";
import type { MarketEvent } from "../../src/types/models/marketEvent.types.js";
import type { MarketCategory } from "../../src/types/models/marketCategory.types.js";
import type { MarketEventTemplate } from "../../src/types/models/marketEventTemplate.types.js";

const event: MarketEvent = {
  id: "42",
  templateId: "manual-diamond-block",
  source: "ADMIN",
  rarity: "EXTRA_RARE",
  scope: "ITEM",
  selectedCategoryId: null,
  selectedItemIds: "diamond",
  effectBasisPoints: -1000,
  effectVersion: 1,
  blocking: true,
  startedAt: "2026-05-28T12:00:00Z",
  endsAt: "2026-05-28T13:00:00Z",
  status: "ACTIVE",
  endReason: null,
  actor: "operator@example.com",
  auditMetadata: null,
  createdAt: "2026-05-28T12:00:00Z",
  updatedAt: "2026-05-28T12:00:00Z",
};

const templates: MarketEventTemplate[] = [
  {
    templateId: "manual-diamond-block",
    rarity: "EXTRA_RARE",
    scope: "ITEM",
    automaticWeight: 0,
    automaticEnabled: false,
    blockingAllowed: true,
    minDurationSeconds: 600,
    maxDurationSeconds: 600,
    minEffectBasisPoints: 10000,
    maxEffectBasisPoints: 10000,
    effectDirection: "BLOCK",
    cooldownSeconds: 3600,
    playerFacingName: "Diamond Block",
    playerFacingDescription: "Diamond purchases are blocked.",
    broadScopeHint: "Diamond",
    eligibleTargetMetadata: '{"itemIds":["diamond"]}',
    createdAt: "2026-05-28T12:00:00Z",
    updatedAt: "2026-05-28T12:00:00Z",
  },
];

const categories: MarketCategory[] = [
  {
    categoryId: "gems",
    displayName: "Gems",
    iconKey: "diamond",
    displayOrder: 1,
    createdAt: "2026-05-28T12:00:00Z",
    updatedAt: "2026-05-28T12:00:00Z",
  },
];

test("MarketEventModalForm renders create and editable event fields", () => {
  const createMarkup = renderToStaticMarkup(
    <MarketEventModalForm
      mode="create"
      templates={templates}
      categories={categories}
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );
  const editMarkup = renderToStaticMarkup(
    <MarketEventModalForm
      mode="edit"
      event={event}
      templates={templates}
      categories={categories}
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(createMarkup, /Create Market Event/);
  assert.match(createMarkup, /Template ID/);
  assert.match(createMarkup, /Scope/);
  assert.match(createMarkup, /Selected Category ID/);
  assert.match(createMarkup, /Selected Item IDs/);
  assert.match(createMarkup, /Select template/);
  assert.match(createMarkup, /Diamond Block \(manual-diamond-block\)/);
  assert.match(createMarkup, /No category/);
  assert.match(createMarkup, /Gems/);
  assert.match(createMarkup, /Effect Basis Points/);
  assert.match(createMarkup, /Duration Seconds/);
  assert.match(createMarkup, /Reason/);
  assert.doesNotMatch(createMarkup, /Ends At/);

  assert.match(editMarkup, /Edit Market Event/);
  assert.match(editMarkup, /Ends At/);
  assert.doesNotMatch(editMarkup, /Template ID/);
  assert.doesNotMatch(editMarkup, /Selected Item IDs/);
});

test("MarketEventModalForm keeps action errors visible and disables duplicate saves", () => {
  const markup = renderToStaticMarkup(
    <MarketEventModalForm
      mode="edit"
      event={event}
      templates={templates}
      categories={categories}
      actionError="API rejected event update."
      submitting
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(markup, /API rejected event update\./);
  assert.match(markup, /Saving\.\.\./);
  assert.match(markup, /disabled=""/);
});

test("toDateTimeLocal preserves local time and round trips unchanged instants", () => {
  const originalTimezone = process.env.TZ;

  process.env.TZ = "America/Sao_Paulo";

  try {
    const localValue = toDateTimeLocal(event.endsAt);
    const result = validateMarketEventForm({
      ...marketEventCreateDefaults,
      templateId: event.templateId,
      scope: event.scope,
      endsAt: localValue,
    });

    assert.equal(localValue, "2026-05-28T10:00");
    assert.equal(result.valid, true);
    assert.equal(
      result.valid ? result.values.updateRequest.endsAt : undefined,
      new Date(event.endsAt).toISOString(),
    );
  } finally {
    if (originalTimezone === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = originalTimezone;
    }
  }
});

test("toDateTimeLocal returns an empty value for invalid API dates", () => {
  assert.equal(toDateTimeLocal("not-a-date"), "");
});

test("validateMarketEventForm blocks obvious local failures", () => {
  const result = validateMarketEventForm({
    ...marketEventCreateDefaults,
    durationSeconds: "0",
    endsAt: "not-a-date",
  });

  assert.equal(result.valid, false);
  assert.equal(
    result.valid ? undefined : result.errors.templateId,
    "This field is required.",
  );
  assert.equal(
    result.valid ? undefined : result.errors.scope,
    "Select a scope.",
  );
  assert.equal(
    result.valid ? undefined : result.errors.durationSeconds,
    "Must be greater than 0.",
  );
  assert.equal(
    result.valid ? undefined : result.errors.endsAt,
    "Enter a valid date.",
  );
});

test("validateMarketEventForm emits separate create and update payloads", () => {
  const result = validateMarketEventForm({
    ...marketEventCreateDefaults,
    templateId: " manual-diamond-block ",
    scope: "ITEM",
    selectedCategoryId: " gems ",
    selectedItemIds: " diamond ",
    effectBasisPoints: "-1000",
    blocking: true,
    durationSeconds: "600",
    endsAt: "2026-05-28T14:00",
    reason: " incident ",
  });

  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.deepEqual(result.values.createRequest, {
    templateId: "manual-diamond-block",
    scope: "ITEM",
    selectedCategoryId: "gems",
    selectedItemIds: "diamond",
    effectBasisPoints: -1000,
    blocking: true,
    durationSeconds: 600,
    reason: "incident",
  });
  assert.deepEqual(result.values.updateRequest, {
    effectBasisPoints: -1000,
    blocking: true,
    durationSeconds: 600,
    endsAt: new Date("2026-05-28T14:00").toISOString(),
    reason: "incident",
  });
  assert.equal("templateId" in result.values.updateRequest, false);
  assert.equal("scope" in result.values.updateRequest, false);
});

test("upsertMarketEventRow preserves update position and prepends new events", () => {
  const olderEvent = { ...event, id: "41" };
  const updatedEvent = { ...event, blocking: false };
  const newEvent = { ...event, id: "43" };

  assert.deepEqual(upsertMarketEventRow([event, olderEvent], updatedEvent), [
    updatedEvent,
    olderEvent,
  ]);
  assert.deepEqual(upsertMarketEventRow([event, olderEvent], newEvent), [
    newEvent,
    event,
    olderEvent,
  ]);
});

test("submitMarketEventSave updates rows only after success and prevents duplicates", async () => {
  const updates: MarketEvent[] = [];
  const errors: Array<string | null> = [];
  const submitting: boolean[] = [];
  let closed = 0;
  let saved = 0;

  await submitMarketEventSave({
    isSubmitting: () => true,
    save: async () => {
      saved += 1;
      return event;
    },
    updateRows: (savedEvent) => updates.push(savedEvent),
    closeModal: () => {
      closed += 1;
    },
    setSubmitting: (value) => submitting.push(value),
    setError: (message) => errors.push(message),
  });

  assert.equal(saved, 0);

  await submitMarketEventSave({
    isSubmitting: () => false,
    save: async () => event,
    updateRows: (savedEvent) => updates.push(savedEvent),
    closeModal: () => {
      closed += 1;
    },
    setSubmitting: (value) => submitting.push(value),
    setError: (message) => errors.push(message),
  });

  assert.deepEqual(updates, [event]);
  assert.equal(closed, 1);
  assert.deepEqual(submitting, [true, false]);
  assert.deepEqual(errors, [null]);
});

test("submitMarketEventSave displays API errors without updating rows", async () => {
  const updates: MarketEvent[] = [];
  const errors: Array<string | null> = [];

  await submitMarketEventSave({
    isSubmitting: () => false,
    save: async () => {
      throw new Error("API rejected event update.");
    },
    updateRows: (savedEvent) => updates.push(savedEvent),
    closeModal: () => {
      throw new Error("Modal should remain open.");
    },
    setSubmitting: () => {},
    setError: (message) => errors.push(message),
  });

  assert.deepEqual(updates, []);
  assert.deepEqual(errors, [null, "API rejected event update."]);
});
