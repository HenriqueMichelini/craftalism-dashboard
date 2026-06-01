---
id: CARD-003
feature: market-events
status: reverified
depends_on:
  - CARD-002
parallel_safe: false
---

# CARD-003: Confirm Market Events Admin Mutation Contract

## Status

reverified

## Objective

Update the dashboard market-events contract so admin mutation UI can consume the API-owned event start, update, cancel, and supersede routes without redefining backend behavior locally.

## Context

The current dashboard contract covers the read-only table and explicitly keeps admin mutation UI out of scope. The API handoff and API source confirm dashboard/admin event mutations under `/api/dashboard/market/events`, protected by `SCOPE_market:admin`. This card only records the consumed contract for dashboard planning and implementation.

Confirmed API-owned routes:

```text
GET   /api/dashboard/market/events
POST  /api/dashboard/market/events
PATCH /api/dashboard/market/events/{id}
POST  /api/dashboard/market/events/{id}/cancel
POST  /api/dashboard/market/events/supersede
```

There is no confirmed `DELETE` route for market events. Dashboard remove/delete behavior must be represented as audited cancellation when the API accepts it.

## Required Reading

- `../contract.md`
- `../../../market-drift-admin-reset-handoff.md`
- `../../../market-items-api-handoff.md`
- `../../../../../craftalism-api/docs/features/market-events/handoff.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/controller/DashboardMarketEventAdminController.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventAdminCreateRequestDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventAdminUpdateRequestDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventAdminCancelRequestDTO.java`

## Expected Behavior

The market-events feature contract documents the dashboard-owned mutation UX surface and the consumed API-owned routes, request fields, response shape, authorization boundary, and delete-as-cancel constraint.

## Acceptance Criteria

- [x] `docs/features/market-events/contract.md` no longer states that all admin mutation UI is out of scope for the expanded feature.
- [x] The contract lists the consumed start, update, cancel, and supersede routes and keeps backend lifecycle, scheduling, pricing, drift, blocking, and audit semantics API-owned.
- [x] The contract documents request fields consumed by the dashboard: `templateId`, `scope`, `selectedCategoryId`, `selectedItemIds`, `effectBasisPoints`, `blocking`, `durationSeconds`, `endsAt`, and `reason` where applicable.
- [x] The contract states that hard delete is not available for events and dashboard removal must use the API-owned cancel route.
- [x] The contract preserves `SCOPE_market:admin` as a consumed authorization boundary and does not introduce dashboard authentication or token acquisition.

## Expected Files to Change

```text
docs/features/market-events/contract.md
docs/features/market-events/cards/CARD-003-confirm-market-events-admin-mutation-contract.md
```

## Constraints

- Do not change source code or tests in this card.
- Do not redefine backend event lifecycle, pricing, scheduling, blocking, drift, audit, validation, authorization, or persistence semantics locally.
- Do not add or imply a `DELETE` market-event route.
- Do not introduce dashboard authentication, token acquisition, browser persistence, API-backed filtering, sorting, pagination, or detail pages.

## Validation Commands

```bash
rg -n "POST  /api/dashboard/market/events|PATCH /api/dashboard/market/events/\\{id\\}|/cancel|supersede|SCOPE_market:admin|hard delete|DELETE" docs/features/market-events/contract.md docs/features/market-events/cards/CARD-003-confirm-market-events-admin-mutation-contract.md
```

## Out of Scope

- React API client implementation
- Modal or table UI implementation
- Backend route, schema, validation, lifecycle, scheduler, pricing, drift, blocking, quote, or audit changes
- Dashboard authentication rollout

## Completion Notes

- Expanded the dashboard-owned Market Events contract from read-only table behavior to include local admin mutation client and UI responsibilities.
- Recorded the consumed API-owned create, update, cancel, and supersede routes, request fields, shared response row shape, and `SCOPE_market:admin` boundary.
- Documented that event removal is audited cancellation and that no hard-delete or `DELETE` route is available.
- Validation passed: the targeted `rg` command found the expected route, authorization, cancel, supersede, and hard-delete constraint documentation.
