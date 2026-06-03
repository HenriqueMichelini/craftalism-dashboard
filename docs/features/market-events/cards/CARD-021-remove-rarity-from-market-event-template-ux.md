---
id: CARD-021
feature: market-events
status: reverified
depends_on:
  - CARD-020
parallel_safe: false
---

# CARD-021: Remove Rarity From Market Event Template UX

## Status

reverified

## Objective

Remove rarity from the market event template management table, modal form, validation, and page tests.

## Context

The template authoring modal currently renders a `Rarity` select and submits it as an authored field. Once the API contract is rarity-free, template UX must expose only fields that remain meaningful: scope, automatic scheduling controls, blocking allowance, duration, effect range, cooldown, player-facing copy, and eligible-target metadata.

This card is not parallel-safe because it changes the same template modal, table configuration, validation module, and focused test file used by related template-management work.

## Required Reading

- `../contract.md`
- `CARD-019-confirm-market-event-rarity-removal-contract.md`
- `CARD-020-remove-rarity-from-dashboard-market-event-models.md`
- `react/src/pages/Dashboard/views/MarketEventTemplatesView/components/MarketEventTemplateModalForm.tsx`
- `react/src/pages/Dashboard/views/MarketEventTemplatesView/config.tsx`
- `react/src/pages/Dashboard/views/MarketEventTemplatesView/marketEventTemplateValidation.ts`
- `react/tests/pages/marketEventTemplateModal.test.tsx`

## Expected Behavior

The market event template modal no longer displays or validates a rarity field, and the submitted create/update request omits rarity. The template table no longer displays a rarity column. Tests assert rarity-free form labels, table output, request payloads, and edit-mode prefill behavior.

## Acceptance Criteria

- [ ] The template modal no longer renders a `Rarity` select or option list.
- [ ] Template form state and validation no longer include `rarity`.
- [ ] Create and update request construction omits `rarity`.
- [ ] The template table configuration removes the `Rarity` column.
- [ ] Template modal/table tests no longer include rarity fixture fields or assertions.
- [ ] Existing validation for required text, JSON metadata, non-negative automatic weight, and positive numeric ranges remains intact.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/MarketEventTemplatesView/components/MarketEventTemplateModalForm.tsx
react/src/pages/Dashboard/views/MarketEventTemplatesView/config.tsx
react/src/pages/Dashboard/views/MarketEventTemplatesView/marketEventTemplateValidation.ts
react/tests/pages/marketEventTemplateModal.test.tsx
```

## Constraints

- Do not change API route paths or introduce new template routes.
- Do not add local cross-field scheduler validation beyond existing obvious input checks.
- Do not derive or display rarity from automatic weight.
- Do not change market event instance modals or tables in this card.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern="MarketEventTemplate|marketEventTemplate"
```

Fallback if the focused pattern is unsupported:

```bash
cd react && npm test
```

## Out of Scope

- API-owned schema, migration, scheduler, validation, persistence, or DTO changes
- Dashboard model/API fixture cleanup covered by `CARD-020`
- Market event instance view cleanup
- Template delete behavior
- Dashboard authentication or permissions changes

## Completion Notes

- Removed the `Rarity` select, rarity form state, rarity validation, and rarity
  request construction from the market event template modal flow.
- Removed the template table `Rarity` column.
- Updated focused template modal/table tests to use rarity-free fixtures and
  request expectations while preserving existing text, JSON, automatic weight,
  and positive numeric validation coverage.
