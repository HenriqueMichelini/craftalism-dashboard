---
id: CARD-010
feature: market-events
status: implemented
depends_on:
  - CARD-009
parallel_safe: true
---

# CARD-010: Replace Template Effect Direction Input With Select

## Status

implemented

## Objective

Replace the raw market event template effect-direction input with a bounded selector.

## Context

The template create modal currently renders `effectDirection` as a free-text field. The API-owned validation in `MarketEventTemplateService` accepts only `UP`, `DOWN`, or `BLOCK`, so the dashboard can present those confirmed values without redefining backend behavior.

## Required Reading

- `../contract.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/market/application/admin/MarketEventTemplateService.java`

## Expected Behavior

The market event template create modal renders `Effect Direction` as a select with an empty prompt and the API-confirmed `UP`, `DOWN`, and `BLOCK` values. Submission continues to send the selected string through the existing template create request.

## Acceptance Criteria

- [ ] `Effect Direction` is rendered as a select instead of a raw text input.
- [ ] The selector includes an empty prompt and exactly the confirmed `UP`, `DOWN`, and `BLOCK` options.
- [ ] Existing required-field validation remains visible when no effect direction is selected.
- [ ] A valid selected direction is preserved in the authored create request.
- [ ] Targeted modal tests cover the selector options and valid request output.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/MarketEventTemplatesView/components/MarketEventTemplateModalForm.tsx
react/tests/pages/marketEventTemplateModal.test.tsx
```

## Constraints

- Do not change API routes or request shapes.
- Do not calculate template validation or pricing behavior locally.
- Do not change unrelated template fields.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern=marketEventTemplate
cd react && npm run build
```

## Out of Scope

- Backend template validation changes
- Eligible-target metadata authoring UX
- Broad-scope-hint authoring UX
- Market event instance modal changes

## Completion Notes

- Replaced the free-text effect-direction field with a required selector for the
  API-confirmed `UP`, `DOWN`, and `BLOCK` values.
- Preserved the existing template create request shape and selected string.
- Added focused coverage for selector options, required validation, and valid
  request output.
- Validation: `cd react && npm test -- --test-name-pattern=marketEventTemplate`
  and `cd react && npm run build` passed.
