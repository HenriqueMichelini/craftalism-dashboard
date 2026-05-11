---
id: CARD-001
feature: dashboard-client
status: planned
depends_on: []
parallel_safe: false
---

# CARD-001: Document Market Snapshot Consumption

## Status

planned

## Objective

Update the dashboard client contract to include read-only market snapshot consumption.

## Context

The shared Craftalism market contract defines `GET /api/market/snapshot` as the public read endpoint for category and item market snapshot data. The current dashboard client contract only documents players, balances, and transactions, so the contract must authorize dashboard-owned market snapshot presentation before frontend implementation starts.

## Required Reading

- `../contract.md`
- `../../../../../craftalism/docs/contracts/market-contract.md`

## Expected Behavior

The dashboard client contract describes market snapshot data as a consumed read-only input and lists `GET /api/market/snapshot` as an external interface. The contract continues to state that backend pricing, quote, execute, buy, sell, auth, durable market state, and market rejection semantics remain outside dashboard ownership unless explicitly scoped later.

## Acceptance Criteria

- [ ] `docs/features/dashboard-client/contract.md` includes market snapshot data in the dashboard read-oriented purpose, goals, inputs, outputs, or equivalent stable behavior sections.
- [ ] `docs/features/dashboard-client/contract.md` lists `GET /api/market/snapshot` as a consumed public read endpoint.
- [ ] The contract explicitly preserves quote, execute, buy, sell, auth, backend pricing, and durable market state as out of scope for this dashboard feature.
- [ ] The contract references the shared market contract as the source of truth for market route and snapshot semantics.

## Expected Files to Change

```text
docs/features/dashboard-client/contract.md
```

## Constraints

- Do not change source, tests, runtime configuration, or backend repositories.
- Do not redefine market API response fields or route semantics locally.
- Do not document dashboard support for write market flows, auth, quote creation, execution, or cached degraded browsing.
- Do not modify unrelated feature contracts.

## Validation Commands

```bash
rg -n "market snapshot|/api/market/snapshot|market-contract|quote|execute|buy|sell|auth" docs/features/dashboard-client/contract.md
```

## Out of Scope

- Implementing the market API client.
- Implementing the market dashboard tab, view, or table.
- Adding or changing backend market routes.
- Adding quote, execute, buy, sell, authentication, or cached degraded browsing behavior.

## Completion Notes

