---
id: CARD-002
feature: market-events
status: planned
depends_on:
  - CARD-001
parallel_safe: false
---

# CARD-002: Display Market Events Table

## Status

planned

## Objective

Add a read-only dashboard Market Events table that lists API-owned market event instances through the confirmed admin read route.

## Context

Market Events are backend-owned operational state. The dashboard table should make active and recent/internal event rows inspectable without recalculating pricing, drift, blocking, lifecycle, scheduler decisions, or quote behavior locally.

This card depends on the API read contract confirmed by `CARD-001`.

## Required Reading

- `../contract.md`
- `../../../conventions.md`
- `../../../architecture/boundaries.md`

## Expected Behavior

The dashboard exposes a top-level `Market Events` tab that fetches `GET /api/dashboard/market/events` and displays market event rows in the existing dashboard table pattern with loading, error, empty, and retry states.

## Acceptance Criteria

- [ ] A `MarketEvent` model type exists with the confirmed response fields from `../contract.md`.
- [ ] A market events API client exposes `getAll()` using `GET /api/dashboard/market/events`.
- [ ] The dashboard includes a top-level tab labeled `Market Events`.
- [ ] The Market Events view renders a read-only table using the existing table component and `useTableData` pattern.
- [ ] The table columns are `Id`, `Template`, `Status`, `Scope`, `Targets`, `Effect`, `Blocking`, `Source`, `Started`, `Ends`, `End Reason`, and `Actor`, in that order.
- [ ] The table preserves backend result order.
- [ ] `startedAt` and `endsAt` use the existing date formatter.
- [ ] Optional target, end reason, and actor values render clearly when absent without inventing values.
- [ ] `effectBasisPoints` is presented as an admin-visible effect value without recalculating prices or event impact locally.
- [ ] The empty state says `No market events found.`
- [ ] API failures, including missing event-admin authority, use the existing table error and retry behavior.
- [ ] Tests cover the market events route assumption and dashboard tab/view wiring.

## Expected Files to Change

```text
react/src/types/models/marketEvent.types.ts
react/src/api/endpoints/marketEvents.ts
react/src/api/index.ts
react/src/pages/Dashboard/DashboardPage.tsx
react/src/pages/Dashboard/views/index.ts
react/src/pages/Dashboard/views/MarketEventsView/
react/tests/api/
react/tests/pages/
```

## Constraints

- Do not start this card until `CARD-001` is reverified or equivalent API contract evidence is explicitly provided.
- Do not implement backend behavior in this repository.
- Do not change unrelated dashboard views.
- Do not calculate drift, event effects, blocked state, lifecycle status, scheduler decisions, quote validity, or pricing locally.
- Do not introduce manual start, update, cancel, supersede, filter, sort, pagination, detail page, browser persistence, or dashboard auth behavior.
- Keep API route usage centralized under `react/src/api/`.

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
- Backend event lifecycle, scheduler, pricing, drift, blocking, quote, or audit semantics
- Admin mutation controls
- Public active-event snapshot display
- API-backed filtering, sorting, or pagination
- Dashboard authentication rollout
- Browser persistence

## Completion Notes

