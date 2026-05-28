# Market Events Contract

## Purpose

The dashboard displays market event instances from API-owned dashboard/admin event routes so operators can inspect active and recent internal market event state.

This feature covers the dashboard table view only. Event pricing, drift, scheduling, lifecycle, blocking, quote interaction, persistence, and admin mutation semantics are owned by `craftalism-api`.

## Ownership

This repository owns:

- dashboard-local API client route usage for market event admin reads
- dashboard table rendering for market event rows
- loading, error, empty, and retry behavior for the market events table
- dashboard-local tests for route usage and view behavior
- dashboard-specific documentation for the table view

This repository consumes:

- market event API route semantics
- market event admin response schema
- backend ordering and recency semantics
- backend authorization and error semantics
- backend event lifecycle, scheduling, blocking, pricing, drift, and audit semantics

## API Contract Prerequisite

Market event state is owned by `craftalism-api`. Dashboard implementation must consume the confirmed dashboard/admin event contract without defining backend behavior locally.

Expected consumed route for the table view:

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/dashboard/market/events` | List internal market event instances for dashboard admin inspection. |

The route is protected by the backend event-admin authority, currently `SCOPE_market:admin`. The standalone dashboard container does not implement built-in authentication; dashboard auth rollout and token acquisition are outside this feature unless separately scoped. Unauthorized or forbidden responses should use the existing table error state.

Admin mutation routes exist in the backend handoff, but this table-view feature does not implement manual start, update, cancel, or supersede controls.

Confirmed backend evidence:

- `DashboardMarketEventAdminController` maps `GET /api/dashboard/market/events` to `MarketEventAdminService.listEvents()`.
- `MarketEventAdminResponseDTO` contains the fields and enum-backed values listed in `Market Event Row`.
- `SecurityConfig` protects `/api/dashboard/market/events/**` with `SCOPE_market:admin`.
- `MarketEventAdminService.listEvents()` currently returns all stored event instances sorted by `createdAt` descending. The dashboard must preserve API result order rather than define independent sort or recency semantics.

## Market Event Row

The dashboard expects each listed event to match this shape after the API contract is confirmed:

```ts
type MarketEvent = {
  id: string;
  templateId: string;
  source: "SCHEDULER" | "ADMIN" | "SYSTEM";
  rarity: "MEDIUM" | "RARE" | "EXTRA_RARE";
  scope: "ITEM" | "ITEM_SET" | "CATEGORY" | "MARKET_WIDE";
  selectedCategoryId: string | null;
  selectedItemIds: string | null;
  effectBasisPoints: number;
  effectVersion: number;
  blocking: boolean;
  startedAt: string;
  endsAt: string;
  status: "SCHEDULED" | "ACTIVE" | "EXPIRED" | "CANCELLED" | "SUPERSEDED";
  endReason: "EXPIRED" | "CANCELLED" | "SUPERSEDED" | null;
  actor: string | null;
  auditMetadata: string | null;
  createdAt: string;
  updatedAt: string;
};
```

The dashboard uses camelCase model fields locally and treats `id` as a string for table rendering.

## Expected Dashboard Behavior

- Market events appear in a top-level dashboard tab labeled `Market Events`.
- The first version is read-only.
- The table preserves backend result order.
- The table displays scan-friendly columns in this order: `Id`, `Template`, `Status`, `Scope`, `Targets`, `Effect`, `Blocking`, `Source`, `Started`, `Ends`, `End Reason`, and `Actor`.
- `Id`, `templateId`, target IDs, and actor values use the same compact monospaced table style as existing dashboard resource identifiers.
- `status`, `scope`, `source`, `rarity`, and `endReason` are displayed as readable labels without changing their backend meaning.
- `effectBasisPoints` is displayed as an admin-visible basis-point value or derived percent label without recalculating event pricing.
- `startedAt` and `endsAt` use the dashboard date formatter.
- Missing optional values display as empty or a neutral placeholder, not fabricated values.
- The empty state says `No market events found.`
- The table reuses existing dashboard loading, error, empty, and retry states.

## Constraints

- Do not calculate drift, event effects, blocked state, quote validity, lifecycle state, or scheduler decisions locally.
- Do not infer public market behavior from admin event metadata.
- Do not expose admin metadata through public `/api/market/**` routes.
- Do not implement manual start, update, cancel, or supersede controls in the table-view slice.
- Do not introduce dashboard authentication, token acquisition, browser persistence, API-backed filters, sorting, pagination, or detail pages unless separately scoped.

## Assumptions And Open Questions

- Assumption: `GET /api/dashboard/market/events` result order is the backend's intended display order for the table.
- Assumption: `auditMetadata` may be too verbose for the initial table and can remain omitted from table columns while still preserved in the local type for future detail views.
- Open question: whether the dashboard should later add admin mutation controls for manual start, update, cancel, and supersede flows.
- Open question: whether the backend will later add query parameters for status, source, date ranges, pagination, or sorting.

## Out of Scope

- Backend event implementation or contract changes
- Backend scheduler, pricing, drift, blocking, quote, or lifecycle semantics
- Admin mutation UI
- Public active-event snapshot display
- Public event history
- API-backed filtering, sorting, or pagination
- Dashboard authentication rollout
- Browser storage or durable client persistence
