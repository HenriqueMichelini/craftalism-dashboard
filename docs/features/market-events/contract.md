# Market Events Contract

## Purpose

The dashboard displays market event instances from API-owned dashboard/admin event routes so operators can inspect active and recent internal market event state.

This feature covers the dashboard table view and dashboard-owned admin mutation controls. Event pricing, drift, scheduling, lifecycle, blocking, quote interaction, persistence, and admin mutation semantics are owned by `craftalism-api`.

## Ownership

This repository owns:

- dashboard-local API client route usage for market event admin reads
- dashboard-local API client route usage for market event admin mutations
- dashboard-local API client route usage for market event template admin reads and creation
- dashboard table rendering for market event rows
- dashboard table rendering and create-form UX for market event templates
- dashboard modal and confirmation UX for starting, editing, cancelling, and superseding market events
- loading, error, empty, and retry behavior for the market events table
- dashboard-local tests for route usage and view behavior
- dashboard-specific documentation for the table view

This repository consumes:

- market event API route semantics
- market event admin response schema
- backend ordering and recency semantics
- backend authorization and error semantics
- backend event lifecycle, scheduling, blocking, pricing, drift, and audit semantics
- backend mutation validation and persistence semantics
- market event template route semantics, validation, persistence, scheduler behavior, pricing behavior, and lifecycle semantics

## API Contract Prerequisite

Market event state is owned by `craftalism-api`. Dashboard implementation must consume the confirmed dashboard/admin event contract without defining backend behavior locally.

Expected consumed route for the table view:

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/dashboard/market/events` | List internal market event instances for dashboard admin inspection. |

The route is protected by the backend event-admin authority, currently `SCOPE_market:admin`. The standalone dashboard container does not implement built-in authentication; dashboard auth rollout and token acquisition are outside this feature unless separately scoped. Unauthorized or forbidden responses should use the existing table error state.

Confirmed consumed mutation routes:

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/dashboard/market/events` | Manually start a market event. |
| `PATCH` | `/api/dashboard/market/events/{id}` | Update editable market event state. |
| `POST` | `/api/dashboard/market/events/{id}/cancel` | Cancel a market event through the API-owned audited lifecycle path. |
| `POST` | `/api/dashboard/market/events/supersede` | End the active event with API-owned `SUPERSEDED` semantics and start its replacement. |

There is no confirmed hard-delete route for market events. Dashboard removal behavior must use the API-owned cancel route and must not introduce a `DELETE` request.

Confirmed backend evidence:

- `DashboardMarketEventAdminController` maps `GET /api/dashboard/market/events` to `MarketEventAdminService.listEvents()`.
- `MarketEventAdminResponseDTO` contains the fields and enum-backed values listed in `Market Event Row`.
- `SecurityConfig` protects `/api/dashboard/market/events/**` with `SCOPE_market:admin`.
- `MarketEventAdminService.listEvents()` currently returns all stored event instances sorted by `createdAt` descending. The dashboard must preserve API result order rather than define independent sort or recency semantics.

## Mutation Requests

The dashboard consumes these API-owned request shapes:

```ts
type MarketEventCreateRequest = {
  templateId: string;
  scope: MarketEvent["scope"];
  selectedCategoryId?: string | null;
  selectedItemIds?: string | null;
  effectBasisPoints?: number | null;
  blocking?: boolean | null;
  durationSeconds?: number | null;
  reason?: string | null;
};

type MarketEventUpdateRequest = {
  effectBasisPoints?: number | null;
  blocking?: boolean | null;
  durationSeconds?: number | null;
  endsAt?: string | null;
  reason?: string | null;
};

type MarketEventCancelRequest = {
  reason?: string | null;
};
```

The API remains authoritative for validation, editable-state rules, lifecycle transitions, active-event selection, audit behavior, and persistence. Supersede consumes the create request shape. All mutation responses use the `MarketEvent` row shape.

## Market Event Template Administration

The dashboard consumes these API-owned template administration routes:

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/dashboard/market/event-templates` | List persisted market event templates for dashboard admin inspection. |
| `POST` | `/api/dashboard/market/event-templates` | Create an authored market event template and return the API-created template row. |
| `PUT` | `/api/dashboard/market/event-templates/{templateId}` | Update an existing authored market event template and return the API-updated template row. |

All template administration routes require the API-owned `SCOPE_market:admin` authority. Browser code must not hold dashboard BFF credentials or acquire admin tokens locally.

The dashboard consumes this API-owned create request shape:

```ts
type MarketEventTemplateCreateRequest = {
  templateId: string;
  rarity: "MEDIUM" | "RARE" | "EXTRA_RARE";
  scope: "ITEM" | "ITEM_SET" | "CATEGORY" | "MARKET_WIDE";
  automaticWeight: number;
  automaticEnabled: boolean;
  blockingAllowed: boolean;
  minDurationSeconds: number;
  maxDurationSeconds: number;
  minEffectBasisPoints: number;
  maxEffectBasisPoints: number;
  effectDirection: string;
  cooldownSeconds: number;
  playerFacingName: string;
  playerFacingDescription: string;
  broadScopeHint: string;
  eligibleTargetMetadata: string;
};
```

The dashboard consumes this API-owned update request shape:

```ts
type MarketEventTemplateUpdateRequest = Omit<
  MarketEventTemplateCreateRequest,
  "templateId"
>;
```

For updates, `templateId` is path-bound and immutable. The update request body does not define template identity, and the API does not perform template rename or upsert behavior.

`effectDirection` is an independently authored API-owned field and must remain in create and update requests. The API validates it against the authored effect basis-point range:

- `UP` templates require `minEffectBasisPoints` greater than `10000`.
- `DOWN` templates require `maxEffectBasisPoints` less than `10000`.
- `BLOCK` templates require neutral `10000` minimum and maximum effect basis points, `blockingAllowed`, item scope, manual scheduling, and rare or extra-rare rarity.

The dashboard should keep the explicit `Effect Direction` selector and submit the selected API-confirmed value. It must not derive, remove, disable, or locally consistency-validate `effectDirection` from basis-point fields beyond obvious form completeness and numeric input checks.

Template list, create, and update responses use this API-owned row shape:

```ts
type MarketEventTemplate = MarketEventTemplateCreateRequest & {
  createdAt: string;
  updatedAt: string;
};
```

Dashboard code may visualize templates and submit authored create and update requests. It must not implement template validation, persistence, scheduler behavior, pricing behavior, or lifecycle semantics locally. Delete operations remain out of scope because no confirmed API route exists for them.

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
- The table preserves backend result order.
- The table displays scan-friendly columns in this order: `Id`, `Template`, `Status`, `Scope`, `Targets`, `Effect`, `Blocking`, `Source`, `Started`, `Ends`, `End Reason`, and `Actor`.
- `Id`, `templateId`, target IDs, and actor values use the same compact monospaced table style as existing dashboard resource identifiers.
- `status`, `scope`, `source`, `rarity`, and `endReason` are displayed as readable labels without changing their backend meaning.
- `effectBasisPoints` is displayed as an admin-visible basis-point value or derived percent label without recalculating event pricing.
- `startedAt` and `endsAt` use the dashboard date formatter.
- Missing optional values display as empty or a neutral placeholder, not fabricated values.
- The empty state says `No market events found.`
- The table reuses existing dashboard loading, error, empty, and retry states.
- Operators can manually start and edit market events through dashboard modals.
- Operators can cancel market events through explicit cancellation UX and supersede the active event through an explicit warning flow.
- Mutation failures remain visible without applying speculative local lifecycle state.

## Constraints

- Do not calculate drift, event effects, blocked state, quote validity, lifecycle state, or scheduler decisions locally.
- Do not infer public market behavior from admin event metadata.
- Do not expose admin metadata through public `/api/market/**` routes.
- Do not calculate mutation results or lifecycle transitions locally; use API responses and refreshes.
- Do not introduce a hard-delete event control or `DELETE` route.
- Do not introduce market event template delete controls or routes.
- Do not introduce dashboard authentication, token acquisition, browser persistence, API-backed filters, sorting, pagination, or detail pages unless separately scoped.

## Assumptions And Open Questions

- Assumption: `GET /api/dashboard/market/events` result order is the backend's intended display order for the table.
- Assumption: `auditMetadata` may be too verbose for the initial table and can remain omitted from table columns while still preserved in the local type for future detail views.
- Open question: whether the backend will later add query parameters for status, source, date ranges, pagination, or sorting.

## Out of Scope

- Backend event implementation or contract changes
- Backend scheduler, pricing, drift, blocking, quote, or lifecycle semantics
- Backend market event template validation, persistence, scheduler, pricing, or lifecycle semantics
- Market event template deletion
- Public active-event snapshot display
- Public event history
- API-backed filtering, sorting, or pagination
- Dashboard authentication rollout
- Browser storage or durable client persistence
