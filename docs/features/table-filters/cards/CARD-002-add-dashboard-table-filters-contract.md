---
id: CARD-002
feature: table-filters
status: reverified
depends_on:
  - CARD-001
parallel_safe: false
---

# CARD-002: Add Dashboard Table Filters Contract

## Status

reverified

## Objective

Document dashboard-owned table filter behavior and consumed API contract assumptions for the first filter slice.

## Context

This card creates or updates dashboard-local feature documentation after shared API filter contracts are confirmed. The dashboard contract must describe only frontend-owned behavior and must point to shared contracts for API query semantics.

## Required Reading

- `../contract.md`
- `../../../repo-contract-map.md`
- `../../../architecture/boundaries.md`
- `../../../context-policy.md`

## Expected Behavior

The table filters feature contract clearly separates dashboard-owned UI/client behavior from consumed backend filtering semantics.

## Acceptance Criteria

- [ ] The feature contract states that dashboard filtering behavior is owned locally.
- [ ] The feature contract states that query parameter names and backend semantics are consumed from shared contracts.
- [ ] The first slice is limited to Transactions and Market Trades.
- [ ] Players and Balances filters are explicitly deferred.
- [ ] Apply and Reset behavior is documented.
- [ ] Text match mode behavior is documented as `contains` by default with `exact` as an option.
- [ ] Filtered and unfiltered empty states are documented separately.
- [ ] Out-of-scope items include backend implementation, sorting, detail pages, mutations, auth rollout, and browser persistence.

## Expected Files to Change

```text
docs/features/table-filters/contract.md
docs/features/table-filters/index.md
docs/features/table-filters/cards/
docs/features/index.md
```

## Constraints

- Do not change React source files.
- Do not define API query parameters locally unless quoting confirmed shared contracts.
- Do not modify unrelated feature contracts.
- Keep one fact in one authoritative home.

## Validation Commands

```bash
git diff --check
```

If broader documentation validation exists later, run it and record the command.

## Out of Scope

- React implementation
- API client implementation
- Backend contract changes
- Players and Balances filter planning beyond explicit deferral

## Completion Notes

Dashboard-owned table filter behavior is documented in `docs/features/table-filters/contract.md`, with API query semantics explicitly consumed from the confirmed `craftalism-api` table filter contract evidence.
