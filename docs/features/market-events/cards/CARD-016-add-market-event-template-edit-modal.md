---
id: CARD-016
feature: market-events
status: reverified
depends_on:
  - CARD-015
parallel_safe: false
---

# CARD-016: Add Market Event Template Edit Modal

## Status

reverified

## Objective

Add dashboard table and modal behavior for editing existing market event templates through the centralized update client.

## Context

The `Market Event Templates` view currently has an `Add Market Event Template` action and a create-only modal. Existing rows have no edit affordance. After the update contract and client exist, operators need a row-level edit action that pre-fills the current API-returned template values and submits changes through the confirmed update route.

This card is not parallel-safe with sibling template view work because it changes the same table, modal form, validation, save action, and focused tests.

## Required Reading

- `../contract.md`
- `CARD-009-add-market-event-template-management-view.md`
- `CARD-014-confirm-market-event-template-update-contract.md`
- `CARD-015-add-market-event-template-update-client.md`

## Expected Behavior

The market event template table exposes a clear edit action for each row. Selecting it opens an edit modal prefilled from the selected API row, including authored eligible-target metadata JSON. Saving submits the confirmed update request through `marketEventTemplatesApi.update(...)`, keeps API validation authoritative, shows API errors without closing, prevents duplicate submits, and replaces the visible row only with the API-returned updated row.

## Acceptance Criteria

- [ ] Each market event template row exposes an accessible edit action.
- [ ] The edit modal title and primary action distinguish edit mode from create mode.
- [ ] Edit mode pre-fills all fields supported by the confirmed update request.
- [ ] `templateId` editability matches the contract recorded by `CARD-014`.
- [ ] Existing create-mode defaults and create submission behavior are preserved.
- [ ] Obvious local checks continue to block blank required text, malformed eligible-target metadata JSON, negative automatic weight, and non-positive duration, effect, or cooldown values before submit where those fields remain editable; the API remains authoritative for cross-field and domain validation.
- [ ] Saving an edit calls `marketEventTemplatesApi.update(...)` once per save attempt and does not call `create(...)`.
- [ ] API errors remain visible without closing the edit modal or changing the visible row.
- [ ] On success, the view replaces the edited row with the API-returned template row without applying speculative local template state.
- [ ] Tests cover the row edit affordance, edit-modal prefill, immutable or editable `templateId` behavior per contract, duplicate-submit prevention, API error handling, successful row replacement, and create-mode regression coverage.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/MarketEventTemplatesView/MarketEventTemplatesView.tsx
react/src/pages/Dashboard/views/MarketEventTemplatesView/components/MarketEventTemplateModalForm.tsx
react/src/pages/Dashboard/views/MarketEventTemplatesView/components/MarketEventTemplateTable.tsx
react/src/pages/Dashboard/views/MarketEventTemplatesView/marketEventTemplateActions.ts
react/src/pages/Dashboard/views/MarketEventTemplatesView/marketEventTemplateRows.ts
react/src/pages/Dashboard/views/MarketEventTemplatesView/marketEventTemplateValidation.ts
react/tests/pages/marketEventTemplateModal.test.tsx
react/tests/pages/marketEventsView.test.tsx
```

## Constraints

- Do not implement edit behavior before `CARD-015` adds the confirmed update client.
- Do not calculate template eligibility, scheduler decisions, effect behavior, blocking behavior, pricing behavior, or lifecycle state locally.
- Do not add template delete, enable, disable, preview, scheduling, or lifecycle controls.
- Do not expose dashboard BFF credentials or tokens to browser code.
- Do not refactor shared table primitives unless the existing API cannot expose a row action.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern="MarketEventTemplates|marketEventTemplate"
cd react && npm run build
```

Fallback if the test runner does not support `--test-name-pattern` in the local Node version:

```bash
cd react && npm test
cd react && npm run build
```

## Out of Scope

- Contract confirmation
- API client route implementation
- Backend route, schema, validation, persistence, scheduler, pricing, blocking, or lifecycle changes
- Market event template deletion
- Template preview or scheduler simulation
- Event-instance modal changes

## Completion Notes

- Added row-level edit actions for market event templates and an edit modal
  mode that pre-fills API-returned template values.
- Preserved path-bound immutable `templateId` behavior by disabling template ID
  editing and submitting update requests without `templateId` in the body.
- Routed edit saves through `marketEventTemplatesApi.update(...)`, kept
  duplicate-submit prevention and API error visibility, and replaced the
  visible row only with the API-returned updated row.
- Preserved create-mode defaults, create submission, and row insertion
  behavior.
- Validation: `npm test -- --test-name-pattern="MarketEventTemplates|marketEventTemplate"`
  and `npm run build` passed from `react/`.
