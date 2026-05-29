# Market Items Execution Index

## Purpose

This index summarizes execution order for market item dashboard implementation cards. Card frontmatter remains the canonical dependency source.

## Execution Order

1. `CARD-001-confirm-api-market-item-crud-contract.md`
2. `CARD-002-build-market-items-crud-table.md`
3. `CARD-003-add-market-drift-reset-admin-action.md`

## Dependency Summary

- `CARD-001` is reverified after `craftalism-api` defined and validated dashboard market item CRUD route semantics and schemas.
- `CARD-002` consumes the confirmed API contract in this dashboard repository.
- `CARD-003` consumes the confirmed API-owned market drift reset route and adds the dashboard-owned guarded admin action after the Market Items table exists.

## Parallelization

These cards must run sequentially because dashboard implementation depends on confirmed API behavior and `CARD-003` changes the existing Market Items action surface.
