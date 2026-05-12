# Table Filters Execution Index

## Purpose

This index summarizes execution order for table filter implementation cards. Card frontmatter remains the canonical dependency source.

## Execution Order

1. `CARD-001-confirm-api-filter-contracts.md`
2. `CARD-002-add-dashboard-table-filters-contract.md`
3. `CARD-003-add-typed-api-filter-request-support.md`
4. `CARD-004-add-reusable-table-filter-controls.md`
5. `CARD-005-wire-transaction-filters.md`
6. `CARD-006-wire-market-trade-filters.md`

## Dependency Summary

- `CARD-001` is blocked until API/shared contracts define filter query semantics.
- `CARD-002` documents dashboard-local behavior after the upstream contract scope is confirmed.
- `CARD-003` depends on confirmed upstream contracts and the dashboard feature contract.
- `CARD-004` depends on the dashboard feature contract and can proceed independently of table-specific wiring once scope is confirmed.
- `CARD-005` and `CARD-006` depend on typed API support and reusable controls.

## Parallelization

After `CARD-001` and `CARD-002` are complete, `CARD-003` and `CARD-004` may be developed separately if their write scopes remain separate.

After `CARD-003` and `CARD-004` are reverified, `CARD-005` and `CARD-006` may be implemented in parallel because they affect different feature views.
