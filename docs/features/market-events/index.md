# Market Events Execution Index

## Purpose

This index summarizes execution order for Market Events dashboard implementation cards. Card frontmatter remains the canonical dependency source.

## Execution Order

1. `CARD-001-confirm-market-events-admin-read-contract.md`
2. `CARD-002-display-market-events-table.md`
3. `CARD-003-confirm-market-events-admin-mutation-contract.md`
4. `CARD-004-add-market-events-admin-mutation-client.md`
5. `CARD-005-add-market-event-create-edit-modal.md`
6. `CARD-006-add-market-event-cancel-supersede-controls.md`

## Dependency Summary

- `CARD-001` confirms the API-owned admin read route, response schema, authorization boundary, and backend ordering assumptions before dashboard implementation begins.
- `CARD-002` depends on the confirmed read contract and implements the dashboard-owned read-only table view.
- `CARD-003` depends on the read-only table and updates the dashboard contract for consumed admin mutation routes before UI implementation begins.
- `CARD-004` depends on the confirmed mutation contract and adds typed API client methods for start, update, cancel, and supersede.
- `CARD-005` depends on the mutation client and adds create/edit modal behavior.
- `CARD-006` depends on the modal foundation and adds cancel/supersede controls.

## Parallelization

`CARD-001`, `CARD-002`, `CARD-003`, `CARD-005`, and `CARD-006` are not parallel-safe with their listed dependencies. `CARD-004` is implementation-parallel-safe only after `CARD-003` is reverified because it is limited to local API client and type coverage.
