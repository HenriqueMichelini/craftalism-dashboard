---
id: CARD-004
feature: market-events
status: reverified
depends_on:
  - CARD-003
parallel_safe: true
---

# CARD-004: Add Market Events Admin Mutation Client

## Status

reverified

## Objective

Add dashboard-local market event request types and API client methods for the confirmed admin start, update, cancel, and supersede routes.

## Context

`marketEventsApi` currently exposes only `getAll()` for `GET /api/dashboard/market/events`. The dashboard cannot submit modal forms until route construction, request payloads, and response mapping are centralized and tested.

## Required Reading

- `../contract.md`
- `CARD-003-confirm-market-events-admin-mutation-contract.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/controller/DashboardMarketEventAdminController.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventAdminCreateRequestDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventAdminUpdateRequestDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventAdminCancelRequestDTO.java`

## Expected Behavior

The market-events API module exposes typed methods for `create`, `update`, `cancel`, and `supersede` that call the confirmed dashboard/admin routes and return normalized `MarketEvent` rows.

## Acceptance Criteria

- [x] Market event create/update/cancel request types are defined in the local model types without changing the existing response row shape.
- [x] `marketEventsApi.create(request)` calls `POST /api/dashboard/market/events`.
- [x] `marketEventsApi.update(id, request)` calls `PATCH /api/dashboard/market/events/{id}` with `id` URL-encoded.
- [x] `marketEventsApi.cancel(id, request)` calls `POST /api/dashboard/market/events/{id}/cancel` with `id` URL-encoded.
- [x] `marketEventsApi.supersede(request)` calls `POST /api/dashboard/market/events/supersede`.
- [x] All mutation methods return a `MarketEvent` with `id` normalized to string, matching `getAll()`.
- [x] API tests cover route construction, HTTP methods, request bodies, URL encoding, and response id normalization.

## Expected Files to Change

```text
react/src/api/endpoints/marketEvents.ts
react/src/types/models/marketEvent.types.ts
react/tests/api/marketEvents.test.ts
```

## Constraints

- Do not add UI in this card.
- Do not calculate lifecycle state, pricing impact, drift, blocking effect, scheduler decisions, or audit metadata locally.
- Do not add a market event `DELETE` client method.
- Do not introduce dashboard authentication, token acquisition, browser persistence, API-backed filtering, sorting, pagination, or detail pages.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern=marketEvents
```

Fallback if the test runner does not support `--test-name-pattern` in the local Node version:

```bash
cd react && npm test
```

## Out of Scope

- Market event modal forms
- Table action wiring
- Backend route, schema, validation, lifecycle, scheduler, pricing, drift, blocking, quote, or audit changes
- Dashboard authentication rollout

## Completion Notes

- Added local create, update, and cancel request types while preserving the existing `MarketEvent` response row shape.
- Added centralized `create`, `update`, `cancel`, and `supersede` methods with encoded event IDs and shared response normalization.
- Added API coverage for mutation routes, methods, request bodies, URL encoding, and string-normalized response IDs.
- Validation passed: `cd react && npm test -- --test-name-pattern=marketEvents` completed with 18 passing tests.
