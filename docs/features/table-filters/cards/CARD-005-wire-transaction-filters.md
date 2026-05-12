---
id: CARD-005
feature: table-filters
status: planned
depends_on:
  - CARD-003
  - CARD-004
parallel_safe: true
---

# CARD-005: Wire Transaction Filters

## Status

planned

## Objective

Add API-backed filter controls to the Transactions dashboard table.

## Context

Transactions are an operational table likely to become pageable. Filtering must request backend-filtered results rather than filtering only the currently loaded page.

## Required Reading

- `../contract.md`
- `./CARD-003-add-typed-api-filter-request-support.md`
- `./CARD-004-add-reusable-table-filter-controls.md`

## Expected Behavior

Admins can apply and reset Transaction filters, and the table displays backend-filtered results with distinct filtered-empty messaging.

## Acceptance Criteria

- [ ] The Transactions view exposes filters for `fromPlayerUuid`, `toPlayerUuid`, match mode, `minAmount`, `maxAmount`, `createdFrom`, and `createdTo`.
- [ ] Editing filter fields does not fetch data until `Apply` is selected.
- [ ] `Apply` fetches Transactions using the active filter criteria.
- [ ] `Reset` clears filters and fetches unfiltered Transactions.
- [ ] If an active filter returns no rows, the empty state says `No records match the selected filters.`
- [ ] The existing unfiltered empty state remains `No transactions found.`
- [ ] Existing loading, error, retry, and table formatting behavior remain intact.
- [ ] Tests cover view wiring and filtered-empty behavior.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/TransactionsView/
react/tests/pages/
react/tests/api/
```

## Constraints

- Do not change Market Trades behavior in this card.
- Do not implement client-side current-page filtering.
- Do not add sorting or detail behavior.
- Preserve existing Transactions columns and formatting.

## Validation Commands

```bash
cd react
npm run lint
npm run test
npm run build
```

If the full validation path is unavailable, run the largest available subset and record the skipped command and reason in completion notes.

## Out of Scope

- Market Trades filters
- Players and Balances filters
- Backend implementation
- Sorting
- Detail pages

## Completion Notes

