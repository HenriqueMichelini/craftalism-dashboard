---
id: CARD-003
feature: market-items
status: implemented
depends_on: ["CARD-002"]
parallel_safe: false
---

# CARD-003: Add Market Drift Reset Admin Action

## Status

implemented

## Objective

Add a guarded dashboard admin action that resets persisted market drift through the confirmed API-owned reset route and refreshes market item rows after success.

## Context

`craftalism-api` now exposes `POST /api/dashboard/market/drift/reset` for market admins with `SCOPE_market:admin`. The dashboard consumes the route only; reset semantics, authorization, recomputation, drift bounds, pricing projections, and backend error behavior remain owned by `craftalism-api`.

The backend handoff is recorded in `../../../market-drift-admin-reset-handoff.md`. It confirms the response shape and API validation evidence for the reset route.

## Required Reading

- `../contract.md`
- `../../../market-drift-admin-reset-handoff.md`
- `../../../conventions.md`
- `../../../architecture/boundaries.md`

## Expected Behavior

The Market Items dashboard view exposes a market-admin drift reset control near the existing market item table actions. The action requires explicit confirmation, submits `POST /api/dashboard/market/drift/reset`, shows loading and error states using existing dashboard action patterns, reports the reset item count on success, and refreshes market item rows so neutral drift projections are reflected from the API response path.

## Acceptance Criteria

- [x] A dashboard-local response type exists for `MarketDriftResetResponse` with `resetItemCount`, `driftMultiplierBasisPoints`, and `driftEvaluatedAt`.
- [x] The centralized market API client exposes a drift reset function that calls `POST /api/dashboard/market/drift/reset`.
- [x] The Market Items view includes a guarded reset action near existing table-level actions.
- [x] The reset action requires explicit confirmation before submitting.
- [x] While reset is submitting, the UI prevents duplicate reset submissions and shows a loading state.
- [x] On success, the UI shows the number of reset items returned by the API.
- [x] On success, the Market Items view refreshes rows from `GET /api/dashboard/market/items` rather than recalculating drift locally.
- [x] API errors are shown through the existing dashboard error/action feedback pattern.
- [x] `401` and `403` responses are treated as the existing admin-auth boundary and are not presented as public market API failures.
- [x] Tests cover route construction, confirmation behavior, duplicate-submit prevention, success feedback with reset count, row refresh after success, and error handling.

## Expected Files to Change

```text
react/src/types/models/marketItem.types.ts
react/src/api/endpoints/marketItems.ts
react/src/pages/Dashboard/views/MarketItemsView/
react/tests/api/marketItems.test.ts
react/tests/pages/
```

## Constraints

- Do not implement backend behavior in this repository.
- Do not redefine reset semantics, authorization rules, drift bounds, pricing recomputation, or backend error semantics locally.
- Do not calculate drift locally.
- Do not expose reset behavior through public `/api/market/**` routes.
- Do not add automatic resets.
- Do not add per-item, per-category, or filtered reset selection.
- Do not change named event lifecycle, scheduler, template, quote pricing, pressure regeneration, or market item CRUD behavior.
- Keep API route usage centralized under `react/src/api/`.
- Use `parallel_safe: false` because this card touches the already implemented Market Items action surface and should not run concurrently with sibling changes in that view.

## Validation Commands

```bash
cd react
npm run lint
npm run test
npm run build
```

If the full validation path is unavailable, run the largest available subset and record the skipped command and reason in completion notes.

## Out of Scope

- Backend reset route implementation
- Backend authorization or scope changes
- Shared API contract changes outside the API-owned repository
- Public market route changes
- Drift history display
- Exact drift calculation display
- Automatic reset scheduling
- Per-item or per-category reset controls
- Market event admin mutation controls
- Dashboard authentication rollout

## Completion Notes

Implemented the dashboard-owned Market Items drift reset action against the confirmed API-owned reset route.

- Added `MarketDriftResetResponse` and centralized `marketItemsApi.resetDrift()` for `POST /api/dashboard/market/drift/reset`.
- Added a guarded `Reset Drift` action beside the Market Items create action.
- The reset action requires confirmation, blocks duplicate submissions with a ref-backed submitting guard, shows `Resetting...` while active, and reports the API reset item count on success.
- On success, the action refreshes rows through the existing Market Items `refetch` path for `GET /api/dashboard/market/items`.
- API failures use dashboard action feedback; `401` and `403` are shown as an admin authorization boundary.
- Added tests for reset route construction, confirmation cancellation, duplicate-submit prevention, success feedback, row refresh ordering, API error handling, and auth-boundary messaging.

Validation:

```bash
cd react
npm run lint
npm run test
npm run build
```

`npm run lint` completed with the existing Tailwind warnings in unrelated table components and no errors. `npm run test` passed 18 tests. `npm run build` completed successfully.
