import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketEventTemplateModalForm } from "../../src/pages/Dashboard/views/MarketEventTemplatesView/components/MarketEventTemplateModalForm.js";
import { MarketEventTemplateTable } from "../../src/pages/Dashboard/views/MarketEventTemplatesView/components/MarketEventTemplateTable.js";
import { submitMarketEventTemplateSave } from "../../src/pages/Dashboard/views/MarketEventTemplatesView/marketEventTemplateActions.js";
import {
  prependMarketEventTemplateRow,
  replaceMarketEventTemplateRow,
} from "../../src/pages/Dashboard/views/MarketEventTemplatesView/marketEventTemplateRows.js";
import {
  marketEventTemplateCreateDefaults,
  toMarketEventTemplateFormValues,
  validateMarketEventTemplateForm,
} from "../../src/pages/Dashboard/views/MarketEventTemplatesView/marketEventTemplateValidation.js";
import type { MarketEventTemplate } from "../../src/types/models/marketEventTemplate.types.js";

const template: MarketEventTemplate = {
  templateId: "rare-wheat-pressure",
  rarity: "RARE",
  scope: "CATEGORY",
  automaticWeight: 4,
  automaticEnabled: true,
  blockingAllowed: false,
  minDurationSeconds: 300,
  maxDurationSeconds: 900,
  minEffectBasisPoints: 10250,
  maxEffectBasisPoints: 10750,
  effectDirection: "UP",
  cooldownSeconds: 1800,
  playerFacingName: "Wheat Pressure",
  playerFacingDescription: "Wheat prices are temporarily elevated.",
  broadScopeHint: "Farming category",
  eligibleTargetMetadata: '{"categoryIds":["farming"]}',
  createdAt: "2026-05-31T12:00:00Z",
  updatedAt: "2026-05-31T12:00:00Z",
};

test("MarketEventTemplateTable renders loading, empty, and scan-friendly row states", () => {
  const loadingMarkup = renderToStaticMarkup(
    <MarketEventTemplateTable data={[]} loading error={null} onRetry={() => {}} />,
  );
  const emptyMarkup = renderToStaticMarkup(
    <MarketEventTemplateTable data={[]} loading={false} error={null} onRetry={() => {}} />,
  );
  const rowMarkup = renderToStaticMarkup(
    <MarketEventTemplateTable
      data={[template]}
      loading={false}
      error={null}
      onRetry={() => {}}
      onEdit={() => {}}
    />,
  );

  assert.match(loadingMarkup, /Loading data\.\.\./);
  assert.match(emptyMarkup, /No market event templates found\./);
  assert.match(rowMarkup, /rare-wheat-pressure/);
  assert.match(rowMarkup, /Rare/);
  assert.match(rowMarkup, /Category/);
  assert.match(rowMarkup, /Yes \(4\)/);
  assert.match(rowMarkup, /Up 10250-10750 bp/);
  assert.match(rowMarkup, /Farming category/);
  assert.doesNotMatch(rowMarkup, /Actions/);
  assert.doesNotMatch(rowMarkup, />Edit</);
});

test("MarketEventTemplateModalForm renders template fields and action errors", () => {
  const markup = renderToStaticMarkup(
    <MarketEventTemplateModalForm
      actionError="API rejected template."
      submitting
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );

  [
    "Template ID",
    "Rarity",
    "Scope",
    "Automatic Weight",
    "Automatic Enabled",
    "Blocking Allowed",
    "Minimum Duration Seconds",
    "Maximum Duration Seconds",
    "Minimum Effect Basis Points",
    "Maximum Effect Basis Points",
    "Effect Direction",
    "Cooldown Seconds",
    "Player-Facing Name",
    "Player-Facing Description",
    "Broad Scope Hint",
    "Eligible Target Metadata JSON",
  ].forEach((label) => assert.match(markup, new RegExp(label)));
  assert.match(markup, /API rejected template\./);
  assert.match(markup, /Saving\.\.\./);
  assert.match(markup, /disabled=""/);
  assert.match(markup, /Derived Effect Direction/);
  assert.match(markup, /Pending basis points/);
  assert.match(markup, /Returned direction is confirmed by the API after save\./);
  assert.doesNotMatch(markup, /Select effect direction/);
});

test("MarketEventTemplateModalForm distinguishes edit mode and pre-fills API row values", () => {
  const markup = renderToStaticMarkup(
    <MarketEventTemplateModalForm
      initialTemplate={template}
      mode="edit"
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(markup, /Edit Market Event Template/);
  assert.match(markup, /Save Changes/);
  assert.match(markup, /value="rare-wheat-pressure"/);
  assert.match(markup, /disabled=""/);
  assert.match(markup, /Wheat prices are temporarily elevated\./);
  assert.match(markup, /\{&quot;categoryIds&quot;:\[&quot;farming&quot;\]\}/);
});

test("validateMarketEventTemplateForm blocks obvious local failures", () => {
  const result = validateMarketEventTemplateForm({
    ...marketEventTemplateCreateDefaults,
    automaticWeight: "-1",
    minDurationSeconds: "0",
    maxDurationSeconds: "0",
    minEffectBasisPoints: "0",
    maxEffectBasisPoints: "0",
    cooldownSeconds: "0",
    eligibleTargetMetadata: "{invalid",
  });

  assert.equal(result.valid, false);
  if (result.valid) return;

  assert.equal(result.errors.templateId, "This field is required.");
  assert.equal(result.errors.automaticWeight, "Must be 0 or greater.");
  assert.equal(result.errors.minDurationSeconds, "Must be greater than 0.");
  assert.equal(result.errors.minEffectBasisPoints, "Must be greater than 0.");
  assert.equal(result.errors.cooldownSeconds, "Must be greater than 0.");
  assert.equal(result.errors.eligibleTargetMetadata, "Enter valid JSON.");
});

test("validateMarketEventTemplateForm emits the complete authored request", () => {
  const result = validateMarketEventTemplateForm({
    templateId: " rare-wheat-pressure ",
    rarity: "RARE",
    scope: "CATEGORY",
    automaticWeight: "4",
    automaticEnabled: true,
    blockingAllowed: false,
    minDurationSeconds: "300",
    maxDurationSeconds: "900",
    minEffectBasisPoints: "10250",
    maxEffectBasisPoints: "10750",
    effectDirection: "",
    cooldownSeconds: "1800",
    playerFacingName: " Wheat Pressure ",
    playerFacingDescription: " Elevated prices. ",
    broadScopeHint: " Farming category ",
    eligibleTargetMetadata: ' {"categoryIds":["farming"]} ',
  });

  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.deepEqual(result.request, {
    templateId: "rare-wheat-pressure",
    rarity: "RARE",
    scope: "CATEGORY",
    automaticWeight: 4,
    automaticEnabled: true,
    blockingAllowed: false,
    minDurationSeconds: 300,
    maxDurationSeconds: 900,
    minEffectBasisPoints: 10250,
    maxEffectBasisPoints: 10750,
    cooldownSeconds: 1800,
    playerFacingName: "Wheat Pressure",
    playerFacingDescription: "Elevated prices.",
    broadScopeHint: "Farming category",
    eligibleTargetMetadata: '{"categoryIds":["farming"]}',
  });
});

test("validateMarketEventTemplateForm emits immutable-templateId update requests", () => {
  const result = validateMarketEventTemplateForm(
    toMarketEventTemplateFormValues(template),
    { includeTemplateId: false },
  );

  assert.equal(result.valid, true);
  if (!result.valid) return;

  assert.equal("templateId" in result.request, false);
  assert.deepEqual(result.request, {
    rarity: "RARE",
    scope: "CATEGORY",
    automaticWeight: 4,
    automaticEnabled: true,
    blockingAllowed: false,
    minDurationSeconds: 300,
    maxDurationSeconds: 900,
    minEffectBasisPoints: 10250,
    maxEffectBasisPoints: 10750,
    cooldownSeconds: 1800,
    playerFacingName: "Wheat Pressure",
    playerFacingDescription: "Wheat prices are temporarily elevated.",
    broadScopeHint: "Farming category",
    eligibleTargetMetadata: '{"categoryIds":["farming"]}',
  });
});

test("template save inserts the API row only after success and prevents duplicates", async () => {
  const inserted: MarketEventTemplate[] = [];
  let saved = 0;

  await submitMarketEventTemplateSave({
    isSubmitting: () => true,
    save: async () => {
      saved += 1;
      return template;
    },
    applyRow: (row) => inserted.push(row),
    closeModal: () => {},
    setSubmitting: () => {},
    setError: () => {},
  });
  assert.equal(saved, 0);

  await submitMarketEventTemplateSave({
    isSubmitting: () => false,
    save: async () => template,
    applyRow: (row) => inserted.push(row),
    closeModal: () => {},
    setSubmitting: () => {},
    setError: () => {},
  });

  assert.deepEqual(inserted, [template]);
  assert.deepEqual(prependMarketEventTemplateRow([], template), [template]);
});

test("template edit replaces only the API-returned row", async () => {
  const updatedTemplate: MarketEventTemplate = {
    ...template,
    playerFacingName: "Updated Wheat Pressure",
    updatedAt: "2026-06-01T12:00:00Z",
  };
  let rows = [
    template,
    {
      ...template,
      templateId: "market-wide-surge",
      playerFacingName: "Market Surge",
    },
  ];

  await submitMarketEventTemplateSave({
    isSubmitting: () => false,
    save: async () => updatedTemplate,
    applyRow: (row) => {
      rows = replaceMarketEventTemplateRow(rows, row);
    },
    closeModal: () => {},
    setSubmitting: () => {},
    setError: () => {},
  });

  assert.equal(rows[0]?.playerFacingName, "Updated Wheat Pressure");
  assert.equal(rows[1]?.playerFacingName, "Market Surge");
});

test("template save displays API errors without inserting or closing", async () => {
  const errors: Array<string | null> = [];

  await submitMarketEventTemplateSave({
    isSubmitting: () => false,
    save: async () => {
      throw new Error("API rejected template.");
    },
    applyRow: () => {
      throw new Error("Row should not be inserted.");
    },
    closeModal: () => {
      throw new Error("Modal should remain open.");
    },
    setSubmitting: () => {},
    setError: (message) => errors.push(message),
  });

  assert.deepEqual(errors, [null, "API rejected template."]);
});
