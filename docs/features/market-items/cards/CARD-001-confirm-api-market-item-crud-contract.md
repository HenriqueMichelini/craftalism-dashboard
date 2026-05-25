---
id: CARD-001
feature: market-items
status: planned
depends_on: []
parallel_safe: false
---

# CARD-001: Confirm API Market Item CRUD Contract

## Status

planned

## Objective

Confirm the API-owned dashboard admin contract for market item create, read, update, and delete operations before the dashboard consumes it.

## Context

The dashboard does not own market item persistence, pricing, stock, regeneration, position, deletion safety, or validation semantics. The owning repository is `craftalism-api`; shared contract documentation must describe the route behavior before dashboard implementation begins.

## Required Reading

- `../contract.md`
- `../../../repo-contract-map.md`
- `../../../architecture/boundaries.md`
- `../../../../../craftalism/docs/contracts/market-contract.md`

## Expected Behavior

The API contract defines dashboard admin market item CRUD routes, request and response shapes, validation behavior, timestamp ownership, and delete rejection semantics clearly enough for the dashboard to consume without inventing backend semantics locally.

## Acceptance Criteria

- [ ] `craftalism-api` defines `GET /api/dashboard/market/items` returning a flat `MarketItem[]`.
- [ ] `craftalism-api` defines `POST /api/dashboard/market/items` returning the created `MarketItem`.
- [ ] `craftalism-api` defines `PATCH /api/dashboard/market/items/{itemId}` returning the updated `MarketItem`.
- [ ] `craftalism-api` defines `DELETE /api/dashboard/market/items/{itemId}` returning `204 No Content` on success.
- [ ] The API contract defines required create fields and defaulted create controls.
- [ ] The API contract defines editable fields and confirms `itemId`, `categoryId`, and `displayName` are immutable after creation.
- [ ] The API contract confirms `lastUpdatedAt` is API-owned and must not be sent by the dashboard.
- [ ] The API contract defines validation and error response behavior for market item constraint violations.
- [ ] The API contract defines delete rejection behavior when a hard delete is not referentially safe.
- [ ] Dashboard implementation can consume the confirmed contract without defining backend semantics locally.

## Expected Files to Change

```text
../../../../../craftalism/docs/contracts/market-contract.md
craftalism-api source and tests
```

## Constraints

- Do not implement backend behavior in this repository.
- Do not define API semantics in dashboard-local docs as the final authority.
- Do not unblock dashboard implementation until API behavior is explicit.
- Use `parallel_safe: false` because the dashboard implementation card depends on this contract decision.

## Validation Commands

```bash
# In the owning API repository, run the relevant backend and contract validation.
# This dashboard repository cannot validate upstream behavior directly.
```

If upstream validation is unavailable, record the missing validation evidence before unblocking dependent dashboard cards.

## Out of Scope

- Dashboard UI implementation
- Dashboard API client implementation
- API-backed filtering
- Sorting
- Detail pages
- Auth rollout

## Completion Notes

