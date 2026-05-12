---
id: CARD-001
feature: table-filters
status: reverified
depends_on: []
parallel_safe: false
---

# CARD-001: Confirm API Filter Contracts

## Status

reverified

## Objective

Confirm shared API filter contracts for Transactions and Market Trades before the dashboard consumes API-backed filtering.

## Context

Pageable table filtering must happen in the API before pagination. This dashboard repository does not own backend query semantics, route contracts, response shapes, or validation behavior.

The owning repositories are `craftalism-api` for backend behavior and the Craftalism governance contracts for shared contract documentation.

## Required Reading

- `../contract.md`
- `../../../repo-contract-map.md`
- `../../../architecture/boundaries.md`
- `../../../../../craftalism/docs/standards/contract-change-checklist.md`
- `../../../../../craftalism/docs/contracts/transaction-routes.md`
- `../../../../../craftalism/docs/contracts/market-contract.md`

## Expected Behavior

The shared contracts define how the dashboard must request filtered Transaction and Market Trade lists, including query parameter names, value encoding, pagination interaction, invalid value behavior, and response shape.

## Acceptance Criteria

- [ ] Shared contracts define filter query semantics for `GET /api/transactions`.
- [ ] Shared contracts define filter query semantics for `GET /api/market/trades`.
- [ ] The contracts state that filters apply before pagination.
- [ ] The contracts define text match mode representation for `contains` and `exact`.
- [ ] The contracts define numeric range behavior for minimum and maximum values.
- [ ] The contracts define date range behavior, timezone handling, and whether boundaries are inclusive.
- [ ] The contracts define enum casing and accepted values for market trade `type`.
- [ ] The contracts define empty result response shape.
- [ ] The contracts define invalid filter value error behavior.
- [ ] The dashboard implementation cards can consume the confirmed contracts without inventing backend semantics locally.

## Expected Files to Change

```text
../../../../../craftalism/docs/contracts/
craftalism-api source and tests, if backend behavior is not already implemented
```

## Constraints

- Do not implement backend behavior in this repository.
- Do not define API query parameter names in dashboard-local docs as authoritative.
- Do not unblock dashboard implementation until shared contract behavior is explicit.
- Use `parallel_safe: false` because downstream dashboard cards depend on this contract decision.

## Validation Commands

```bash
# In the owning repository, run the relevant contract/backend validation.
# This dashboard repository cannot validate upstream behavior directly.
```

If upstream validation is unavailable, record the missing validation evidence before unblocking dependent dashboard cards.

## Out of Scope

- Dashboard UI implementation
- Dashboard API client implementation
- Players and Balances filters
- Sorting
- Detail pages
- Auth rollout

## Open Questions

- Are date range boundaries inclusive?
- Are UUID `contains` searches supported by backend indexes?
- Should text match mode be per field or shared across text filters?
- Should transaction list responses remain arrays or adopt a paged response shape?

## Completion Notes

Confirmed for dashboard consumption from `../craftalism-api/docs/features/table-filters/contract.md` after user approval. The API evidence defines filter query semantics for `GET /api/transactions` and `GET /api/market/trades`, filters-before-pagination behavior, per-field `contains`/`exact` match modes, inclusive numeric and instant ranges, canonical market trade `side` values, empty `Page<T>` response shapes, and invalid filter `ProblemDetail` behavior.

The dashboard remains a consumer of API semantics and does not redefine backend filter behavior locally.
