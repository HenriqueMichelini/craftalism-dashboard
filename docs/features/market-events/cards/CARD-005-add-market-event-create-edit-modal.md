---
id: CARD-005
feature: market-events
status: reverified
depends_on:
  - CARD-004
parallel_safe: false
---

# CARD-005: Add Market Event Create And Edit Modal

## Status

reverified

## Objective

Add modal forms that let operators manually start market events and edit editable event state from the Market Events table view.

## Context

The Market Events view is currently read-only: it renders the table but has no header action, no row click behavior, no modal state, and no mutation error handling. Existing dashboard CRUD views use a shared modal pattern where create and edit share a form, failures remain visible in the modal, and table rows update only after API success.

## Required Reading

- `../contract.md`
- `CARD-003-confirm-market-events-admin-mutation-contract.md`
- `CARD-004-add-market-events-admin-mutation-client.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventAdminCreateRequestDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventAdminUpdateRequestDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventAdminCancelRequestDTO.java`

## Expected Behavior

The Market Events view exposes an `Add Market Event` action and row-click edit behavior. Create mode submits a manual start request; edit mode submits an update request for editable event state. The table updates with the API-returned row only after success.

## Acceptance Criteria

- [x] The Market Events header includes an `Add Market Event` action that opens a create modal.
- [x] Clicking a market event row opens an edit modal for that row.
- [x] The modal captures start fields: `templateId`, `scope`, `selectedCategoryId`, `selectedItemIds`, `effectBasisPoints`, `blocking`, `durationSeconds`, and `reason`.
- [x] The modal captures edit fields: `effectBasisPoints`, `blocking`, `durationSeconds`, `endsAt`, and `reason`; immutable row identity and backend-owned lifecycle fields are not submitted as editable values.
- [x] Create submits `marketEventsApi.create()` and inserts or updates the returned row in the existing table data.
- [x] Edit submits `marketEventsApi.update()` and replaces the matching row with the returned row.
- [x] The modal prevents duplicate submissions while saving and displays API errors without closing.
- [x] Obvious local validation blocks blank `templateId`, missing `scope`, non-positive `durationSeconds` when present, and malformed date input before submit; the API remains authoritative for all constraints.
- [x] Tests cover header action rendering, create/edit modal rendering, validation behavior, duplicate-submit prevention, success row update, and API error display.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/MarketEventsView/MarketEventsView.tsx
react/src/pages/Dashboard/views/MarketEventsView/components/MarketEventTable.tsx
react/src/pages/Dashboard/views/MarketEventsView/components/MarketEventModalForm.tsx
react/src/pages/Dashboard/views/MarketEventsView/marketEventRows.ts
react/src/pages/Dashboard/views/MarketEventsView/marketEventValidation.ts
react/tests/pages/dashboardViews.test.tsx
react/tests/pages/marketEventModal.test.tsx
```

## Constraints

- Do not add cancel, supersede, or hard-delete controls in this card.
- Do not calculate lifecycle state, pricing impact, drift, blocking effect, scheduler decisions, or audit metadata locally.
- Do not edit `actor`, `auditMetadata`, `createdAt`, `updatedAt`, `startedAt`, `status`, `endReason`, `source`, `rarity`, or `effectVersion` locally.
- Do not introduce dashboard authentication, token acquisition, browser persistence, API-backed filtering, sorting, pagination, or detail pages.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern="MarketEvents|marketEvent"
```

Fallback if the test runner does not support `--test-name-pattern` in the local Node version:

```bash
cd react && npm test
```

## Out of Scope

- Cancel and supersede controls
- Market event hard delete
- Backend route, schema, validation, lifecycle, scheduler, pricing, drift, blocking, quote, or audit changes
- Dashboard authentication rollout

## Completion Notes

- Lifted Market Events row state into the view so create and edit mutations update table rows only after API success.
- Added the `Add Market Event` header action, row-click edit behavior, create/edit modal, local obvious-input validation, and API error display.
- Added a save helper that prevents duplicate in-flight submissions and a row upsert helper that preserves update order while prepending newly returned rows.
- Added modal, validation, row-helper, save-helper, and dashboard header coverage.
- Validation passed: `cd react && npm test -- --test-name-pattern="MarketEvents|marketEvent"` completed with 19 passing tests.
