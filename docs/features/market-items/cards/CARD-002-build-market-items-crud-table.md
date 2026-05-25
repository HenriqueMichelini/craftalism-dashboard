---
id: CARD-002
feature: market-items
status: planned
depends_on: ["CARD-001"]
parallel_safe: false
---

# CARD-002: Build Market Items CRUD Table

## Status

planned

## Objective

Add a dashboard Market Items view that lists, creates, edits, and removes market items through confirmed API-owned admin routes.

## Context

Market item data has many behavior-sensitive pricing, stock, regeneration, and position fields. The table should stay scan-friendly while a modal exposes the full editable configuration.

This card depends on the API contract confirmed by `CARD-001`.

## Required Reading

- `../contract.md`
- `../../../conventions.md`
- `../../../architecture/boundaries.md`

## Expected Behavior

The dashboard exposes a top-level `Market Items` tab that fetches `GET /api/dashboard/market/items`, displays a focused table, opens a grouped modal for create/edit, validates obvious constraint failures before submit, calls confirmed create/update/delete routes, and preserves existing dashboard loading, error, empty, and retry patterns.

## Acceptance Criteria

- [ ] A `MarketItem` model type exists with all fields defined by the confirmed API contract.
- [ ] A market items API client exposes `getAll`, `create`, `update`, and `delete` functions using the confirmed routes.
- [ ] The dashboard includes a top-level tab labeled `Market Items`.
- [ ] The Market Items view renders a table using the existing table and `useTableData` patterns.
- [ ] The table columns are `Item`, `Category`, `Buy Estimate`, `Sell Estimate`, `Currency`, `Stock`, `Variation %`, `Blocked`, `Operating`, and `Last Updated`, in that order.
- [ ] The table preserves backend result order.
- [ ] The empty state says `No market items found.`
- [ ] Clicking a row opens the edit modal.
- [ ] The create action opens the same modal in create mode.
- [ ] The modal groups fields into `Identity`, `Pricing`, `Stock & Position`, `Regeneration`, and `State`.
- [ ] Create mode allows editing identity fields and pre-fills the defaulted tuning controls.
- [ ] Edit mode makes `itemId`, `categoryId`, and `displayName` read-only.
- [ ] The dashboard never sends `lastUpdatedAt` in create or update requests.
- [ ] Dashboard validation blocks the obvious constraint violations listed in the feature contract before submit.
- [ ] Delete shows confirmation, waits for API success, removes the row on success, and keeps the row plus shows the API error on rejection.
- [ ] Tests cover route construction, dashboard tab/view wiring, modal validation, create/update request payloads, and delete success/rejection behavior.

## Expected Files to Change

```text
react/src/types/models/marketItem.types.ts
react/src/api/endpoints/marketItems.ts
react/src/api/index.ts
react/src/pages/Dashboard/DashboardPage.tsx
react/src/pages/Dashboard/views/index.ts
react/src/pages/Dashboard/views/MarketItemsView/
react/tests/api/
react/tests/pages/
```

## Constraints

- Do not start this card until `CARD-001` is reverified or equivalent API contract evidence is explicitly provided.
- Do not implement backend behavior in this repository.
- Do not change unrelated dashboard views.
- Do not introduce API-backed filtering, sorting, detail pages, browser persistence, or local soft-delete behavior.
- Keep API route usage centralized under `react/src/api/`.
- Keep dashboard validation as UX only; API validation remains authoritative.

## Validation Commands

```bash
cd react
npm run lint
npm run test
npm run build
```

If the full validation path is unavailable, run the largest available subset and record the skipped command and reason in completion notes.

## Out of Scope

- Backend route implementation
- Backend response schema changes
- Shared contract updates outside the prerequisite API card
- API-backed filtering
- Sorting
- Detail pages
- Auth rollout
- Browser persistence

## Completion Notes

