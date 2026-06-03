---
id: CARD-022
feature: market-events
status: reverified
depends_on:
  - CARD-020
parallel_safe: true
---

# CARD-022: Remove Rarity From Market Event Instance UX

## Status

reverified

## Objective

Remove remaining dashboard market event instance fixture and UI expectations for rarity.

## Context

The current market event table does not render a dedicated rarity column, but dashboard event row types, fixtures, and tests still carry `rarity`. After API-owned event rows become rarity-free, the dashboard must treat rarity as absent rather than hidden or locally derived.

## Required Reading

- `../contract.md`
- `CARD-019-confirm-market-event-rarity-removal-contract.md`
- `CARD-020-remove-rarity-from-dashboard-market-event-models.md`
- `react/src/pages/Dashboard/views/MarketEventsView/config.tsx`
- `react/src/pages/Dashboard/views/MarketEventsView/components/MarketEventModalForm.tsx`
- `react/tests/pages/marketEventModal.test.tsx`
- `react/tests/pages/dashboardViews.test.tsx`

## Expected Behavior

Market event instance views, modals, and tests continue to render and edit API-owned event state without requiring `rarity` in event fixtures or selected templates. No UI displays, derives, or preserves rarity.

## Acceptance Criteria

- [ ] Market event page and modal tests no longer include `rarity` in event or template fixtures.
- [ ] Market event instance UI does not render rarity and does not include hidden rarity assumptions.
- [ ] Template selector behavior continues to use `templateId`, player-facing name, and API-owned scope without rarity.
- [ ] Create, edit, cancel, and supersede test expectations remain unchanged except for rarity-free fixtures.
- [ ] A repository search confirms no dashboard source or tests reference `MarketEventRarity` or `.rarity` for market events.

## Expected Files to Change

```text
react/tests/pages/marketEventModal.test.tsx
react/tests/pages/dashboardViews.test.tsx
react/src/pages/Dashboard/views/MarketEventsView/
```

## Constraints

- Do not change API route paths or mutation request shapes except for consuming the confirmed rarity-free responses from `CARD-020`.
- Do not change lifecycle, scheduler, target selection, audit reason, cancellation, supersede, or effect behavior.
- Do not derive rarity locally from template properties or event fields.
- Do not change market event template management UX in this card.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern="MarketEventModal|MarketEventsView|dashboardViews"
```

Fallback if the focused pattern is unsupported:

```bash
cd react && npm test
```

## Out of Scope

- API-owned schema, migration, scheduler, validation, persistence, or DTO changes
- Dashboard model/API fixture cleanup covered by `CARD-020`
- Market event template management UX cleanup covered by `CARD-021`
- Dashboard authentication or permissions changes

## Completion Notes

- Removed rarity fields from market event instance and selected-template page
  fixtures.
- Confirmed the market event instance config and modal do not render rarity or
  derive it from selected templates.
