# Market Events Execution Index

## Purpose

This index summarizes execution order for Market Events dashboard implementation cards. Card frontmatter remains the canonical dependency source.

## Execution Order

1. `CARD-001-confirm-market-events-admin-read-contract.md`
2. `CARD-002-display-market-events-table.md`

## Dependency Summary

- `CARD-001` confirms the API-owned admin read route, response schema, authorization boundary, and backend ordering assumptions before dashboard implementation begins.
- `CARD-002` depends on the confirmed read contract and implements the dashboard-owned read-only table view.

## Parallelization

These cards are not parallel-safe with each other. The table implementation must wait until the admin read contract has been confirmed or equivalent evidence is explicitly recorded.
