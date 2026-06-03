---
id: CARD-017
feature: market-events
status: planned
depends_on:
  - CARD-011
parallel_safe: false
---

# CARD-017: Derive Market Event Target Controls From Template Scope

## Status

planned

## Objective

Render only the market event target control that is relevant to the selected template scope in the create and supersede modal flows.

## Context

The market event create and supersede modal currently renders both `Selected Category ID` and `Selected Item IDs` for every selected template. Operators can therefore enter item IDs for category-only templates, or a category ID for item-set templates, even though the selected template row already exposes an API-owned `scope` value.

The dashboard owns modal rendering and request assembly, but the API remains authoritative for template validation, lifecycle behavior, scheduler behavior, target interpretation, and persistence.

This card is not parallel-safe because it changes the same market event modal and focused tests used by sibling modal work.

## Required Reading

- `../contract.md`
- `CARD-011-add-market-event-reference-selectors.md`
- `../../../../react/src/pages/Dashboard/views/MarketEventsView/components/MarketEventModalForm.tsx`
- `../../../../react/src/pages/Dashboard/views/MarketEventsView/marketEventValidation.ts`

## Expected Behavior

When an operator selects a template in create or supersede mode, the modal derives the active scope from the selected template row. Category-scoped templates show the category selector and omit the item-ID input. Item and item-set templates show the item-ID input and omit the category selector. Market-wide templates omit both target controls. Submitting the form sends only target values relevant to the selected template scope while preserving the existing create request shape and API-authoritative validation.

## Acceptance Criteria

- [ ] The create and supersede modal derive the selected template row from `values.templateId` and the `templates` prop.
- [ ] Selecting a template updates or locks the submitted `scope` to the selected template `scope` so operators cannot submit a mismatched template/scope pair through normal modal interaction.
- [ ] `CATEGORY` templates render the category selector, hide `Selected Item IDs`, and submit no `selectedItemIds` value.
- [ ] `ITEM` and `ITEM_SET` templates render `Selected Item IDs`, hide the category selector, and submit no `selectedCategoryId` value.
- [ ] `MARKET_WIDE` templates hide both target controls and submit neither target value.
- [ ] With no template selected, the modal does not fabricate a scope or target value and still shows the existing required-template validation behavior.
- [ ] Existing edit-mode behavior remains unchanged because template and target fields are not editable there.
- [ ] Focused tests cover category-only, item/item-set, market-wide, no-template-selected, supersede-mode, and edit-mode regression behavior.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/MarketEventsView/components/MarketEventModalForm.tsx
react/src/pages/Dashboard/views/MarketEventsView/marketEventValidation.ts
react/tests/pages/marketEventModal.test.tsx
react/tests/pages/marketEventsView.test.tsx
```

## Constraints

- Do not change API routes or request shapes.
- Do not redefine backend template validation, target interpretation, lifecycle, pricing, scheduler, or persistence behavior locally.
- Do not introduce selected-item multi-select UX or new item-ID serialization assumptions.
- Do not modify market event template authoring UX.
- Do not change edit-mode target or template fields.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern="MarketEventModalForm|validateMarketEventForm|MarketEvents"
cd react && npm run build
```

Fallback if the local test runner does not support the focused pattern:

```bash
cd react && npm test
```

## Out of Scope

- Backend request-schema changes
- Backend market event validation, lifecycle, scheduler, pricing, target interpretation, or persistence changes
- Selected-item multi-select UX
- Market event template create or edit modal changes
- API-backed item lookup or item set expansion

## Completion Notes

Leave empty until implemented.
