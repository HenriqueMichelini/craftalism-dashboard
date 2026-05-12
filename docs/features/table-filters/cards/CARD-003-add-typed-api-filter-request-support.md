---
id: CARD-003
feature: table-filters
status: planned
depends_on:
  - CARD-001
  - CARD-002
parallel_safe: false
---

# CARD-003: Add Typed API Filter Request Support

## Status

planned

## Objective

Add typed request construction for API-backed Transaction and Market Trade table filters.

## Context

Dashboard API clients currently expose unfiltered `getAll()` behavior. After shared query contracts are confirmed, the dashboard needs typed filter criteria and centralized request construction that matches those contracts exactly.

## Required Reading

- `../contract.md`
- `./CARD-001-confirm-api-filter-contracts.md`
- `../../../architecture/boundaries.md`

## Expected Behavior

Transaction and Market Trade API clients accept typed filter criteria and build canonical filtered request URLs without emitting stale or empty query parameters.

## Acceptance Criteria

- [ ] Transactions API request support includes `fromPlayerUuid`, `toPlayerUuid`, text match mode, `minAmount`, `maxAmount`, `createdFrom`, and `createdTo`.
- [ ] Market Trades API request support includes `type`, `playerUuid`, `itemId`, text match mode, `minTotalPrice`, `maxTotalPrice`, `createdFrom`, and `createdTo`.
- [ ] Query string construction matches the confirmed shared contracts exactly.
- [ ] Empty, undefined, or reset criteria do not produce stale query parameters.
- [ ] Existing unfiltered `getAll()` behavior remains available or is preserved through an equivalent empty-filter request.
- [ ] Tests cover generated URLs or requested endpoints for both filtered and reset/unfiltered requests.

## Expected Files to Change

```text
react/src/api/client.ts
react/src/api/endpoints/transactions.ts
react/src/api/endpoints/marketTrades.ts
react/src/types/models/transaction.types.ts
react/src/types/models/marketTrade.types.ts
react/tests/api/
```

## Constraints

- Do not change dashboard view behavior in this card.
- Do not invent query parameter names; consume confirmed shared contracts.
- Keep API path changes centralized under `react/src/api/`.
- Preserve existing route usage and market trade response mapping.

## Validation Commands

```bash
cd react
npm run lint
npm run test
npm run build
```

If the full validation path is unavailable, run the largest available subset and record the skipped command and reason in completion notes.

## Out of Scope

- Filter controls
- Table view wiring
- Backend implementation
- Players and Balances filters
- Sorting

## Completion Notes

