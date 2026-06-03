---
id: CARD-011
feature: market-events
status: reverified
depends_on:
  - CARD-008
parallel_safe: true
---

# CARD-011: Add Market Event Reference Selectors

## Status

reverified

## Objective

Replace raw market event template and category ID entry with API-backed selectors in the event create modal.

## Context

The market event create modal currently requires operators to type `templateId` and `selectedCategoryId` manually. The dashboard already has centralized read clients for market event templates and market categories, including human-readable template and category fields suitable for selector labels.

`selectedItemIds` remains an API-owned opaque string. There is no confirmed serialization contract for converting selected market items into that field, so it must remain unchanged until the owning API contract defines the representation.

## Required Reading

- `../contract.md`
- `../../../../react/src/api/endpoints/marketEventTemplates.ts`
- `../../../../react/src/api/endpoints/marketCategories.ts`
- `../../../../react/src/pages/Dashboard/views/MarketItemsView/MarketItemsView.tsx`

## Expected Behavior

The Market Events view loads templates and categories through their existing centralized clients. Its create modal presents template and category selectors with readable labels while preserving the selected IDs in the existing market event create request.

## Acceptance Criteria

- [ ] `MarketEventsView` loads market event templates through `marketEventTemplatesApi.getAll()` and categories through `marketCategoriesApi.getAll()`.
- [ ] The create modal receives template and category rows through props without issuing API requests itself.
- [ ] `Template ID` is rendered as a select that submits the selected `templateId` and displays a readable template label.
- [ ] `Selected Category ID` is rendered as an optional select that submits the selected `categoryId` and displays `displayName`.
- [ ] The category selector retains an empty option so non-category event scopes can omit `selectedCategoryId`.
- [ ] Loading or lookup failures are represented using existing dashboard view patterns and do not silently replace IDs with fabricated values.
- [ ] Existing event creation request shape and API-authoritative validation remain unchanged.
- [ ] Targeted tests cover selector rendering and preservation of selected IDs in the create request.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/MarketEventsView/MarketEventsView.tsx
react/src/pages/Dashboard/views/MarketEventsView/components/MarketEventModalForm.tsx
react/tests/pages/marketEventModal.test.tsx
react/tests/pages/marketEventsView.test.tsx
```

## Constraints

- Do not change API routes or request shapes.
- Do not implement backend lifecycle or validation behavior locally.
- Do not introduce item-ID serialization assumptions.
- Do not modify template creation UX in this card.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern="MarketEvents|marketEvent"
cd react && npm run build
```

## Out of Scope

- Selected-item multi-select UX
- Backend request-schema changes
- Template authoring modal changes
- Cancel and supersede controls

## Completion Notes

- Loaded template and category reference rows in `MarketEventsView` through the
  existing centralized clients.
- Passed reference rows into the create modal and replaced raw template and
  category ID entry with readable selectors while preserving selected IDs in
  the existing create request shape.
- Kept selected-item ID authoring unchanged and added retryable lookup error
  states using the existing dashboard view pattern.
- Added focused coverage for selector rendering, selected-ID request output,
  and lookup-loading behavior.
- Validation: `cd react && npm test --
  --test-name-pattern="MarketEvents|marketEvent"` and `cd react && npm run
  build` passed.
- Reverification: `npm test -- --test-name-pattern="MarketEvents|marketEvent"`
  and `npm run build` passed from `react/` in the current tree.
