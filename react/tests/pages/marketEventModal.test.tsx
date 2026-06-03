import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketEventModalForm } from "../../src/pages/Dashboard/views/MarketEventsView/components/MarketEventModalForm.js";
import {
  submitMarketEventCancel,
  submitMarketEventSave,
  submitMarketEventSupersede,
} from "../../src/pages/Dashboard/views/MarketEventsView/marketEventActions.js";
import { toDateTimeLocal } from "../../src/pages/Dashboard/views/MarketEventsView/marketEventDateTime.js";
import { getMarketEventAuditReason } from "../../src/pages/Dashboard/views/MarketEventsView/marketEventAudit.js";
import { upsertMarketEventRow } from "../../src/pages/Dashboard/views/MarketEventsView/marketEventRows.js";
import {
  applyTemplateScopeToMarketEventValues,
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

const scopedTemplates: MarketEventTemplate[] = [
  templates[0],
  {
    ...templates[0],
    templateId: "category-gem-surge",
    scope: "CATEGORY",
    playerFacingName: "Gem Surge",
  },
  {
    ...templates[0],
    templateId: "item-set-tools-sale",
    scope: "ITEM_SET",
    playerFacingName: "Tools Sale",
  },
  {
    ...templates[0],
    templateId: "market-wide-surge",
    scope: "MARKET_WIDE",
    playerFacingName: "Market Surge",
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
      onCancelEvent={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(createMarkup, /Create Market Event/);
  assert.match(createMarkup, /Template ID/);
  assert.match(createMarkup, /Scope/);
  assert.match(createMarkup, /Select template/);
  assert.match(createMarkup, /Diamond Block \(manual-diamond-block\)/);
  assert.doesNotMatch(createMarkup, /Selected Category ID/);
  assert.doesNotMatch(createMarkup, /Selected Item IDs/);
  assert.match(createMarkup, /Effect Basis Points/);
  assert.match(createMarkup, /Duration Seconds/);
  assert.match(createMarkup, /Reason/);
  assert.doesNotMatch(createMarkup, /Ends At/);

  assert.match(editMarkup, /Edit Market Event/);
  assert.match(editMarkup, /Ends At/);
  assert.match(editMarkup, /Latest Audit Reason/);
  assert.match(editMarkup, /Not provided/);
  assert.match(editMarkup, /Cancel Market Event/);
  assert.doesNotMatch(editMarkup, /Template ID/);
  assert.doesNotMatch(editMarkup, /Selected Item IDs/);
});

test("MarketEventModalForm displays the saved audit reason only in edit mode", () => {
  const savedReasonEvent = {
    ...event,
    auditMetadata: '{"reason":"operator correction"}',
  };
  const editMarkup = renderToStaticMarkup(
    <MarketEventModalForm
      mode="edit"
      event={savedReasonEvent}
      templates={templates}
      categories={categories}
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );
  const createMarkup = renderToStaticMarkup(
    <MarketEventModalForm
      mode="create"
      templates={templates}
      categories={categories}
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(editMarkup, /Latest Audit Reason/);
  assert.match(editMarkup, /operator correction/);
  assert.match(editMarkup, /name="reason" value=""/);
  assert.doesNotMatch(createMarkup, /Latest Audit Reason/);
});

test("getMarketEventAuditReason falls back for malformed or reason-less metadata", () => {
  assert.equal(getMarketEventAuditReason(null), "Not provided");
  assert.equal(getMarketEventAuditReason("{not-json"), "Not provided");
  assert.equal(getMarketEventAuditReason("{}"), "Not provided");
  assert.equal(getMarketEventAuditReason('{"reason":""}'), "Not provided");
  assert.equal(getMarketEventAuditReason('{"reason":42}'), "Not provided");
  assert.equal(
    getMarketEventAuditReason('{"reason":" saved update "}'),
    "saved update",
  );
});

test("MarketEventModalForm renders supersede warning and create fields", () => {
  const markup = renderToStaticMarkup(
    <MarketEventModalForm
      mode="supersede"
      templates={templates}
      categories={categories}
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(markup, /Supersede Active Event/);
  assert.match(markup, /API-owned SUPERSEDED semantics/);
  assert.match(markup, /The API selects the active event/);
  assert.match(markup, /Template ID/);
  assert.doesNotMatch(markup, /Selected Category ID/);
  assert.doesNotMatch(markup, /Selected Item IDs/);
  assert.doesNotMatch(markup, /Cancel Market Event/);
});

test("template scope normalization keeps only category targets for category templates", () => {
  const scopedValues = applyTemplateScopeToMarketEventValues(
    {
      ...marketEventCreateDefaults,
      templateId: "category-gem-surge",
      scope: "ITEM",
      selectedCategoryId: " gems ",
      selectedItemIds: "diamond",
    },
    scopedTemplates,
  );
  const result = validateMarketEventForm(scopedValues);

  assert.equal(scopedValues.scope, "CATEGORY");
  assert.equal(scopedValues.selectedItemIds, "");
  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.equal(result.values.createRequest.scope, "CATEGORY");
  assert.equal(result.values.createRequest.selectedCategoryId, "gems");
  assert.equal(result.values.createRequest.selectedItemIds, undefined);
});

test("template scope normalization keeps only item targets for item and item-set templates", () => {
  const itemValues = applyTemplateScopeToMarketEventValues(
    {
      ...marketEventCreateDefaults,
      templateId: "manual-diamond-block",
      scope: "CATEGORY",
      selectedCategoryId: "gems",
      selectedItemIds: " diamond ",
    },
    scopedTemplates,
  );
  const itemSetValues = applyTemplateScopeToMarketEventValues(
    {
      ...marketEventCreateDefaults,
      templateId: "item-set-tools-sale",
      scope: "CATEGORY",
      selectedCategoryId: "gems",
      selectedItemIds: " pickaxe,axe ",
    },
    scopedTemplates,
  );

  assert.equal(itemValues.scope, "ITEM");
  assert.equal(itemValues.selectedCategoryId, "");
  assert.equal(itemSetValues.scope, "ITEM_SET");
  assert.equal(itemSetValues.selectedCategoryId, "");

  const itemSetResult = validateMarketEventForm(itemSetValues);
  assert.equal(itemSetResult.valid, true);
  if (!itemSetResult.valid) return;

  assert.equal(itemSetResult.values.createRequest.scope, "ITEM_SET");
  assert.equal(itemSetResult.values.createRequest.selectedCategoryId, undefined);
  assert.equal(itemSetResult.values.createRequest.selectedItemIds, "pickaxe,axe");
});

test("template scope normalization clears all targets for market-wide templates", () => {
  const scopedValues = applyTemplateScopeToMarketEventValues(
    {
      ...marketEventCreateDefaults,
      templateId: "market-wide-surge",
      scope: "ITEM",
      selectedCategoryId: "gems",
      selectedItemIds: "diamond",
    },
    scopedTemplates,
  );
  const result = validateMarketEventForm(scopedValues);

  assert.equal(scopedValues.scope, "MARKET_WIDE");
  assert.equal(scopedValues.selectedCategoryId, "");
  assert.equal(scopedValues.selectedItemIds, "");
  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.equal(result.values.createRequest.scope, "MARKET_WIDE");
  assert.equal(result.values.createRequest.selectedCategoryId, undefined);
  assert.equal(result.values.createRequest.selectedItemIds, undefined);
});

test("no selected template does not fabricate scope or target values", () => {
  const scopedValues = applyTemplateScopeToMarketEventValues(
    {
      ...marketEventCreateDefaults,
      selectedCategoryId: "gems",
      selectedItemIds: "diamond",
    },
    scopedTemplates,
  );
  const result = validateMarketEventForm(scopedValues);

  assert.equal(scopedValues.scope, "");
  assert.equal(scopedValues.selectedCategoryId, "gems");
  assert.equal(scopedValues.selectedItemIds, "diamond");
  assert.equal(result.valid, false);
  assert.equal(result.valid ? undefined : result.errors.templateId, "This field is required.");
  assert.equal(result.valid ? undefined : result.errors.scope, "Select a scope.");
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

test("submitMarketEventCancel requires confirmation and submits the trimmed reason", async () => {
  const cancelledEvents: MarketEvent[] = [];
  const requests: Array<{ id: string; reason?: string | null }> = [];
  let closed = 0;

  await submitMarketEventCancel({
    isSubmitting: () => false,
    eventId: event.id,
    reason: " maintenance ",
    confirm: () => false,
    cancel: async (id, request) => {
      requests.push({ id, ...request });
      return { ...event, status: "CANCELLED" };
    },
    updateRows: (cancelledEvent) => cancelledEvents.push(cancelledEvent),
    closeModal: () => {
      closed += 1;
    },
    setSubmitting: () => {},
    setError: () => {},
  });

  assert.equal(requests.length, 0);

  await submitMarketEventCancel({
    isSubmitting: () => false,
    eventId: event.id,
    reason: " maintenance ",
    confirm: () => true,
    cancel: async (id, request) => {
      requests.push({ id, ...request });
      return { ...event, status: "CANCELLED" };
    },
    updateRows: (cancelledEvent) => cancelledEvents.push(cancelledEvent),
    closeModal: () => {
      closed += 1;
    },
    setSubmitting: () => {},
    setError: () => {},
  });

  assert.deepEqual(requests, [{ id: "42", reason: "maintenance" }]);
  assert.deepEqual(cancelledEvents, [{ ...event, status: "CANCELLED" }]);
  assert.equal(closed, 1);
});

test("submitMarketEventCancel prevents duplicate submissions and keeps errors visible", async () => {
  const errors: Array<string | null> = [];
  let cancelCalls = 0;

  await submitMarketEventCancel({
    isSubmitting: () => true,
    eventId: event.id,
    reason: "",
    confirm: () => {
      throw new Error("confirmation should not run while submitting");
    },
    cancel: async () => {
      cancelCalls += 1;
      return event;
    },
    updateRows: () => {},
    closeModal: () => {},
    setSubmitting: () => {},
    setError: (message) => errors.push(message),
  });

  await submitMarketEventCancel({
    isSubmitting: () => false,
    eventId: event.id,
    reason: "",
    confirm: () => true,
    cancel: async () => {
      cancelCalls += 1;
      throw new Error("API rejected event cancellation.");
    },
    updateRows: () => {
      throw new Error("Rows should remain unchanged.");
    },
    closeModal: () => {
      throw new Error("Modal should remain open.");
    },
    setSubmitting: () => {},
    setError: (message) => errors.push(message),
  });

  assert.equal(cancelCalls, 1);
  assert.deepEqual(errors, [null, "API rejected event cancellation."]);
});

test("submitMarketEventSupersede submits the replacement and refreshes backend rows", async () => {
  const replacement = { ...event, id: "43" };
  const events: string[] = [];
  const request = {
    templateId: "manual-diamond-block",
    scope: "ITEM" as const,
    selectedItemIds: "diamond",
    reason: "replacement",
  };

  await submitMarketEventSupersede({
    isSubmitting: () => false,
    request,
    supersede: async (submittedRequest) => {
      assert.deepEqual(submittedRequest, request);
      events.push("supersede");
      return replacement;
    },
    updateRows: (savedEvent) => {
      assert.equal(savedEvent, replacement);
      events.push("upsert");
    },
    refreshRows: async () => {
      events.push("refresh");
    },
    closeModal: () => {
      events.push("close");
    },
    setSubmitting: () => {},
    setError: () => {},
  });

  assert.deepEqual(events, ["supersede", "upsert", "refresh", "close"]);
});

test("submitMarketEventSupersede prevents duplicate submissions", async () => {
  let supersedeCalls = 0;

  await submitMarketEventSupersede({
    isSubmitting: () => true,
    request: {
      templateId: "manual-diamond-block",
      scope: "ITEM",
    },
    supersede: async () => {
      supersedeCalls += 1;
      return event;
    },
    updateRows: () => {},
    refreshRows: async () => {},
    closeModal: () => {},
    setSubmitting: () => {},
    setError: () => {},
  });

  assert.equal(supersedeCalls, 0);
});
