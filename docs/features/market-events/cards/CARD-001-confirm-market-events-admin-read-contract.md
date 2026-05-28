---
id: CARD-001
feature: market-events
status: reverified
depends_on: []
parallel_safe: false
---

# CARD-001: Confirm Market Events Admin Read Contract

## Status

reverified

## Objective

Confirm the API-owned dashboard/admin read contract for market event table rows before the dashboard consumes it.

## Context

The backend handoff says market event admin routes exist under `/api/dashboard/market/events` and expose internal event metadata only to callers with the dedicated event-admin authority. The dashboard owns only route consumption and presentation; `craftalism-api` owns event lifecycle, pricing, scheduling, blocking, audit, and authorization semantics.

## Required Reading

- `../contract.md`
- `../../../architecture/boundaries.md`
- `../../../../../craftalism-api/docs/features/market-events/handoff.md`

## Expected Behavior

The dashboard has enough confirmed contract evidence to implement a read-only market events table without inventing backend route, response, ordering, authorization, or lifecycle semantics locally.

## Acceptance Criteria

- [x] `craftalism-api` confirms `GET /api/dashboard/market/events` returns internal event rows for dashboard admin inspection.
- [x] The response shape is confirmed for the table fields in `../contract.md`, including enum values, optional fields, timestamp fields, and numeric effect fields.
- [x] The API authorization boundary is confirmed as `SCOPE_market:admin` or an explicitly documented equivalent event-admin authority.
- [x] Backend ordering or recency behavior is confirmed, or the dashboard table card records that it must preserve API order without promising sort semantics.
- [x] Backend error behavior for unauthorized, forbidden, and failed read requests is confirmed well enough for the dashboard to use the existing table error state.
- [x] Any mismatch between `../contract.md` and the backend handoff or source is resolved before `CARD-002` begins.

## Expected Files to Change

```text
docs/features/market-events/contract.md
docs/features/market-events/cards/CARD-001-confirm-market-events-admin-read-contract.md
```

## Constraints

- Do not implement dashboard source code in this card.
- Do not modify files inside `../craftalism-api`.
- Do not redefine API-owned event lifecycle, pricing, scheduling, blocking, audit, or authorization semantics locally.
- Keep dashboard authentication rollout out of scope unless a separate feature explicitly scopes it.
- Use `parallel_safe: false` because the table implementation depends on this contract confirmation.

## Validation Commands

```bash
rg -n "market-events|Market Events|/api/dashboard/market/events|SCOPE_market:admin" docs/features docs/index.md
```

If upstream validation evidence is unavailable, record the missing evidence before unblocking dependent dashboard cards.

## Out of Scope

- Dashboard UI implementation
- Dashboard API client implementation
- Backend route or DTO changes
- Admin mutation controls
- API-backed filtering, sorting, or pagination
- Dashboard authentication rollout

## Completion Notes

- Confirmed `DashboardMarketEventAdminController` maps `GET /api/dashboard/market/events` to `MarketEventAdminService.listEvents()`.
- Confirmed `MarketEventAdminResponseDTO` exposes the response fields documented in the dashboard contract.
- Confirmed enum values from backend model enums: `SCHEDULER`, `ADMIN`, `SYSTEM`; `MEDIUM`, `RARE`, `EXTRA_RARE`; `ITEM`, `ITEM_SET`, `CATEGORY`, `MARKET_WIDE`; `SCHEDULED`, `ACTIVE`, `EXPIRED`, `CANCELLED`, `SUPERSEDED`; `EXPIRED`, `CANCELLED`, `SUPERSEDED`.
- Confirmed `SecurityConfig` protects `/api/dashboard/market/events/**` with `SCOPE_market:admin`.
- Resolved handoff/source ordering wording by documenting current backend behavior: `listEvents()` returns all stored event instances sorted by `createdAt` descending, and the dashboard table must preserve API order.
