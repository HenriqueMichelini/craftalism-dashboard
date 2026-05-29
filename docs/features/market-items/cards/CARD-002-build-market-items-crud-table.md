---
id: CARD-002
feature: market-items
status: reverified
depends_on: ["CARD-001"]
parallel_safe: false
---

# CARD-002: Build Market Items CRUD Table

## Status

reverified

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

- [x] A `MarketItem` model type exists with all fields defined by the confirmed API contract.
- [x] A market items API client exposes `getAll`, `create`, `update`, and `delete` functions using the confirmed routes.
- [x] The dashboard includes a top-level tab labeled `Market Items`.
- [x] The Market Items view renders a table using the existing table and `useTableData` patterns.
- [x] The table columns are `Item`, `Category`, `Buy Estimate`, `Sell Estimate`, `Currency`, `Stock`, `Variation %`, `Blocked`, `Operating`, and `Last Updated`, in that order.
- [x] The table preserves backend result order.
- [x] The empty state says `No market items found.`
- [x] Clicking a row opens the edit modal.
- [x] The create action opens the same modal in create mode.
- [x] The modal groups fields into `Identity`, `Pricing`, `Stock & Position`, `Regeneration`, and `State`.
- [x] Create mode allows editing identity fields and pre-fills the defaulted tuning controls.
- [x] Edit mode makes `itemId`, `categoryId`, and `displayName` read-only.
- [x] The dashboard never sends `lastUpdatedAt` in create or update requests.
- [x] The dashboard never sends API-recomputed projection fields `buyUnitEstimate`, `sellUnitEstimate`, `currentStock`, `variationPercent`, or `marketMomentum` in create or update requests.
- [x] Dashboard validation blocks the obvious constraint violations listed in the feature contract before submit.
- [x] Delete shows confirmation, waits for API success, removes the row on success, and keeps the row plus shows the API error on rejection.
- [x] Tests cover route construction, dashboard tab/view wiring, modal validation, create/update request payloads, and delete success/rejection behavior.

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

Implemented the dashboard-owned Market Items CRUD UI against the confirmed API contract.

- Added `MarketItem` model and centralized market item API client for `GET`, `POST`, `PATCH`, and `DELETE` dashboard routes.
- Added a top-level `Market Items` tab and view using `useTableData` plus the existing dynamic table loading, empty, error, and retry states.
- Added a scan-friendly table with the required columns and backend-order-preserving data flow.
- Added a grouped create/edit modal with identity, pricing, stock and position, regeneration, and state sections.
- Create mode pre-fills API/DB default tuning values; edit mode makes `itemId`, `categoryId`, and `displayName` read-only.
- Create/update payloads omit `lastUpdatedAt` and API-recomputed projection fields.
- Delete uses confirmation, waits for API success before removing the row, and preserves the row while showing structured API error messages on rejection.
- Added tests for route construction, request payloads, tab/view wiring, table columns, modal defaults/read-only fields, validation, and delete row handling.

Validation:

```bash
cd react
npm run lint
npm run test
npm run build
```

`npm run lint` completed with existing Tailwind warnings in unrelated table components and no errors.
