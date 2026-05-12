---
id: CARD-006
feature: table-filters
status: planned
depends_on:
  - CARD-003
  - CARD-004
parallel_safe: true
---

# CARD-006: Wire Market Trade Filters

## Status

planned

## Objective

Add API-backed filter controls to the Market Trades dashboard table.

## Context

Market Trades already consume a backend-owned market trade history route and may use a paged response shape. Filtering must request backend-filtered results rather than filtering only the currently loaded page.

## Required Reading

- `../contract.md`
- `./CARD-003-add-typed-api-filter-request-support.md`
- `./CARD-004-add-reusable-table-filter-controls.md`
- `../../market-trades/contract.md`

## Expected Behavior

Admins can apply and reset Market Trade filters, and the table displays backend-filtered results with distinct filtered-empty messaging.

## Acceptance Criteria

- [ ] The Market Trades view exposes filters for `type`, `playerUuid`, `itemId`, match mode, `minTotalPrice`, `maxTotalPrice`, `createdFrom`, and `createdTo`.
- [ ] `type` supports all, buy, and sell options.
- [ ] Editing filter fields does not fetch data until `Apply` is selected.
- [ ] `Apply` fetches Market Trades using the active filter criteria.
- [ ] `Reset` clears filters and fetches unfiltered Market Trades.
- [ ] If an active filter returns no rows, the empty state says `No records match the selected filters.`
- [ ] The existing unfiltered empty state remains `No market trades found.`
- [ ] Existing market trade labels, currency formatting, date formatting, loading, error, and retry behavior remain intact.
- [ ] Tests cover view wiring and filtered-empty behavior.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/MarketTradesView/
react/tests/pages/
react/tests/api/
```

## Constraints

- Do not change Transactions behavior in this card.
- Do not implement client-side current-page filtering.
- Do not redefine backend market trade semantics.
- Preserve existing Market Trades columns and formatting.

## Validation Commands

```bash
cd react
npm run lint
npm run test
npm run build
```

If the full validation path is unavailable, run the largest available subset and record the skipped command and reason in completion notes.

## Out of Scope

- Transactions filters
- Players and Balances filters
- Backend implementation
- Sorting
- Detail pages

## Completion Notes

