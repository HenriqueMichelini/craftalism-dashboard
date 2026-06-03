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
7. `CARD-007-confirm-market-event-template-admin-contract.md`
8. `CARD-008-add-market-event-template-admin-client.md`
9. `CARD-009-add-market-event-template-management-view.md`
10. `CARD-010-replace-template-effect-direction-input-with-select.md`
11. `CARD-011-add-market-event-reference-selectors.md`
12. `CARD-012-preserve-local-time-in-market-event-edit-modal.md`
13. `CARD-013-display-market-event-audit-reason.md`
14. `CARD-014-confirm-market-event-template-update-contract.md`
15. `CARD-015-add-market-event-template-update-client.md`
16. `CARD-016-add-market-event-template-edit-modal.md`
17. `CARD-017-derive-market-event-target-controls-from-template-scope.md`
18. `CARD-018-confirm-market-event-template-effect-direction-contract.md`

## Dependency Summary

- `CARD-001` confirms the API-owned admin read route, response schema, authorization boundary, and backend ordering assumptions before dashboard implementation begins.
- `CARD-002` depends on the confirmed read contract and implements the dashboard-owned read-only table view.
- `CARD-003` depends on the read-only table and updates the dashboard contract for consumed admin mutation routes before UI implementation begins.
- `CARD-004` depends on the confirmed mutation contract and adds typed API client methods for start, update, cancel, and supersede.
- `CARD-005` depends on the mutation client and adds create/edit modal behavior.
- `CARD-006` depends on the modal foundation and adds cancel/supersede controls.
- `CARD-007` records the confirmed API-owned template list/create contract and can proceed independently from the remaining event-instance controls.
- `CARD-008` depends on the confirmed template contract and adds the typed template API client.
- `CARD-009` depends on the template client and adds the dedicated template table and create modal.
- `CARD-010` depends on the template management view and replaces free-text effect-direction entry with an API-confirmed selector.
- `CARD-011` depends on the template client and adds API-backed template and category selectors to the market event create modal.
- `CARD-012` depends on the create/edit modal foundation and preserves browser-local `endsAt` hours when editing market events.
- `CARD-013` depends on the create/edit modal foundation and exposes the API-returned audit reason for operator inspection without redefining lifecycle end reasons.
- `CARD-014` depends on the template management view and is blocked until `craftalism-api` owns and documents a template update route.
- `CARD-015` depends on the confirmed template update contract and adds the typed update client.
- `CARD-016` depends on the update client and adds row-level template edit modal behavior.
- `CARD-017` depends on the reference selector modal work and derives create/supersede target controls from the selected template scope without changing API request shapes.
- `CARD-018` depends on the confirmed template admin contract and records whether template effect direction is independently authored or derived from effect basis-point ranges before any modal UX change.

## Parallelization

`CARD-001`, `CARD-002`, `CARD-003`, `CARD-005`, `CARD-006`, `CARD-007`, `CARD-009`, `CARD-012`, `CARD-013`, `CARD-016`, and `CARD-017` are not parallel-safe with their listed dependencies. `CARD-004`, `CARD-008`, `CARD-010`, `CARD-011`, `CARD-014`, `CARD-015`, and `CARD-018` are implementation-parallel-safe only after their prerequisite cards are reverified because their source changes do not overlap.
