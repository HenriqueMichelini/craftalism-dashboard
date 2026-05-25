# Market Items Execution Index

## Purpose

This index summarizes execution order for market item dashboard implementation cards. Card frontmatter remains the canonical dependency source.

## Execution Order

1. `CARD-001-confirm-api-market-item-crud-contract.md`
2. `CARD-002-build-market-items-crud-table.md`

## Dependency Summary

- `CARD-001` is blocked until `craftalism-api` defines and validates dashboard market item CRUD route semantics and schemas.
- `CARD-002` consumes the confirmed API contract in this dashboard repository.

## Parallelization

These cards must run sequentially because dashboard implementation depends on confirmed API behavior.
