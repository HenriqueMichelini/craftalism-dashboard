import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketEventTemplateModalForm } from "../../src/pages/Dashboard/views/MarketEventTemplatesView/components/MarketEventTemplateModalForm.js";
import { MarketEventTemplateTable } from "../../src/pages/Dashboard/views/MarketEventTemplatesView/components/MarketEventTemplateTable.js";
import { submitMarketEventTemplateSave } from "../../src/pages/Dashboard/views/MarketEventTemplatesView/marketEventTemplateActions.js";
import { prependMarketEventTemplateRow } from "../../src/pages/Dashboard/views/MarketEventTemplatesView/marketEventTemplateRows.js";
import {
  marketEventTemplateCreateDefaults,
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
  minEffectBasisPoints: 250,
  maxEffectBasisPoints: 750,
  effectDirection: "INCREASE",
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
    <MarketEventTemplateTable data={[template]} loading={false} error={null} onRetry={() => {}} />,
  );

  assert.match(loadingMarkup, /Loading data\.\.\./);
  assert.match(emptyMarkup, /No market event templates found\./);
  assert.match(rowMarkup, /rare-wheat-pressure/);
  assert.match(rowMarkup, /Rare/);
  assert.match(rowMarkup, /Category/);
  assert.match(rowMarkup, /Yes \(4\)/);
  assert.match(rowMarkup, /Increase 250-750 bp/);
  assert.match(rowMarkup, /Farming category/);
});

test("MarketEventTemplateModalForm renders every authored field and action errors", () => {
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
    minEffectBasisPoints: "250",
    maxEffectBasisPoints: "750",
    effectDirection: " INCREASE ",
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
    minEffectBasisPoints: 250,
    maxEffectBasisPoints: 750,
    effectDirection: "INCREASE",
    cooldownSeconds: 1800,
    playerFacingName: "Wheat Pressure",
    playerFacingDescription: "Elevated prices.",
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
    insertRow: (row) => inserted.push(row),
    closeModal: () => {},
    setSubmitting: () => {},
    setError: () => {},
  });
  assert.equal(saved, 0);

  await submitMarketEventTemplateSave({
    isSubmitting: () => false,
    save: async () => template,
    insertRow: (row) => inserted.push(row),
    closeModal: () => {},
    setSubmitting: () => {},
    setError: () => {},
  });

  assert.deepEqual(inserted, [template]);
  assert.deepEqual(prependMarketEventTemplateRow([], template), [template]);
});

test("template save displays API errors without inserting or closing", async () => {
  const errors: Array<string | null> = [];

  await submitMarketEventTemplateSave({
    isSubmitting: () => false,
    save: async () => {
      throw new Error("API rejected template.");
    },
    insertRow: () => {
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
