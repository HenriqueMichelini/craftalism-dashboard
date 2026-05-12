---
id: CARD-004
feature: table-filters
status: reverified
depends_on:
  - CARD-002
parallel_safe: true
---

# CARD-004: Add Reusable Table Filter Controls

## Status

reverified

## Objective

Add reusable table filter UI and state primitives for explicit Apply and Reset workflows.

## Context

Transactions and Market Trades need consistent filter controls. Field edits should update draft state only; API requests should happen when the user applies the filters.

## Required Reading

- `../contract.md`
- `../../../architecture/boundaries.md`
- `../../../conventions.md`

## Expected Behavior

Reusable filter controls support text, enum, number range, and date range inputs with Apply and Reset actions that can be wired into table views.

## Acceptance Criteria

- [ ] Text filter controls support `contains` by default and `exact` as an option.
- [ ] Enum controls can represent all, buy, and sell options for market trade type.
- [ ] Number range controls support minimum and maximum values.
- [ ] Date range controls support from and to values.
- [ ] Field edits update draft filter state without triggering fetches.
- [ ] `Apply` exposes the current draft criteria to the parent view.
- [ ] `Reset` clears draft and active criteria.
- [ ] Controls are accessible and fit existing dashboard styling.
- [ ] Component tests cover Apply, Reset, and draft state behavior.

## Expected Files to Change

```text
react/src/components/ui/
react/src/types/table.types.ts
react/tests/components/
```

## Constraints

- Do not wire controls into specific views in this card.
- Do not import feature views from shared components.
- Do not add browser storage.
- Do not trigger network requests directly from shared controls.

## Validation Commands

```bash
cd react
npm run lint
npm run test
npm run build
```

If the full validation path is unavailable, run the largest available subset and record the skipped command and reason in completion notes.

## Out of Scope

- API query construction
- Transactions view wiring
- Market Trades view wiring
- Backend implementation
- Sorting

## Completion Notes

Added reusable table filter controls for text, enum, number range, date range, match mode, explicit Apply, and Reset workflows. Field edits remain draft-only inside the control until Apply is submitted, and Reset clears local draft criteria while notifying the parent view.

Validation:

- `npm run lint`: passed with pre-existing Tailwind warnings outside the new filter files.
- `npm run test`: passed.
- `npm run build`: passed.
