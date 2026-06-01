---
id: CARD-009
feature: market-events
status: reverified
depends_on:
  - CARD-008
parallel_safe: false
---

# CARD-009: Add Market Event Template Management View

## Status

reverified

## Objective

Add a dashboard view that visualizes existing market event templates and lets operators create new templates.

## Context

The dashboard already exposes event-instance inspection and controls. Operators also need a dedicated template view so they can inspect API-owned template configuration and submit new authored templates without editing backend seed code.

This card is not parallel-safe with dashboard navigation work because it updates the shared dashboard view switch and shared dashboard view tests.

## Required Reading

- `../contract.md`
- `CARD-007-confirm-market-event-template-admin-contract.md`
- `CARD-008-add-market-event-template-admin-client.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventTemplateCreateRequestDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventTemplateResponseDTO.java`

## Expected Behavior

The dashboard exposes a top-level `Market Event Templates` tab with a scan-friendly template table and an `Add Market Event Template` action. The create modal submits authored values through the centralized client, keeps API validation authoritative, and updates visible rows only after API success.

## Acceptance Criteria

- [ ] A top-level `Market Event Templates` dashboard tab renders a dedicated management view.
- [ ] The view lists templates through `marketEventTemplatesApi.getAll()` and reuses existing loading, error, empty, and retry patterns.
- [ ] The table displays scan-friendly columns for template identity, rarity, scope, automatic configuration, blocking allowance, duration range, effect direction and range, cooldown, player-facing name, broad scope hint, and update timestamp.
- [ ] The empty state says `No market event templates found.`
- [ ] The view exposes an `Add Market Event Template` action that opens a create modal.
- [ ] The modal captures every API-owned create request field, including authored eligible-target metadata JSON.
- [ ] Obvious local input checks prevent blank required text, malformed eligible-target metadata JSON, negative automatic weight, and non-positive duration, effect, or cooldown values before submit; the API remains authoritative for cross-field and domain validation.
- [ ] Create submits `marketEventTemplatesApi.create()` once per save attempt, displays API errors without closing, and inserts the API-returned row only after success.
- [ ] The view does not expose update or delete controls.
- [ ] Tests cover tab rendering, loading and empty states, table rendering, modal fields, obvious local validation, duplicate-submit prevention, success row insertion, and API error display.

## Expected Files to Change

```text
react/src/pages/Dashboard/DashboardPage.tsx
react/src/pages/Dashboard/views/MarketEventTemplatesView/
react/tests/pages/dashboardViews.test.tsx
react/tests/pages/marketEventTemplateModal.test.tsx
```

## Constraints

- Do not add update, delete, enable, disable, preview, or scheduling controls.
- Do not calculate template eligibility, scheduler decisions, effect behavior, blocking behavior, pricing behavior, or lifecycle state locally.
- Do not expose dashboard BFF credentials or tokens to browser code.
- Do not refactor shared table primitives unless the existing API cannot render the required columns.

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

- Template update or deletion
- Template preview or scheduler simulation
- Event-instance modal changes
- Deployment BFF route forwarding
- Backend route, schema, validation, persistence, scheduler, pricing, blocking, or lifecycle changes

## Completion Notes

- Added the top-level `Market Event Templates` view, scan-friendly table, and
  create action.
- Added a create modal for every confirmed API request field with narrow local
  input checks while leaving API-owned domain validation authoritative.
- Added duplicate-submit prevention, retained API error display, and insertion
  of the API-returned row only after success.
- Added view, table, modal, validation, submit-action, and row-insertion tests.
- Validation and reverification: `cd react && npm test --
  --test-name-pattern="MarketEventTemplates|marketEventTemplate"` and
  `cd react && npm run build` passed.
