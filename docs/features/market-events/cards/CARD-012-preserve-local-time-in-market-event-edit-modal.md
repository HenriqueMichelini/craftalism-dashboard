---
id: CARD-012
feature: market-events
status: implemented
depends_on:
  - CARD-005
parallel_safe: false
---

# CARD-012: Preserve Local Time In Market Event Edit Modal

## Status

implemented

## Objective

Keep the market event edit modal hour aligned with the dashboard table when prefilling an API-provided `endsAt` instant.

## Context

The Market Events table renders API instants with the dashboard date formatter, which displays browser-local time. The edit modal currently prefills its `datetime-local` input with `new Date(value).toISOString().slice(0, 16)`, which writes a UTC wall-clock value into a timezone-less browser control. Submitting the unchanged input then interprets that UTC value as local time and can shift the API instant.

This card is not parallel-safe because it changes the same modal and focused test file used by other market event modal work.

## Required Reading

- `../contract.md`
- `CARD-005-add-market-event-create-edit-modal.md`

## Expected Behavior

Opening an existing market event in edit mode displays the same local `endsAt` hour shown by the dashboard date formatter. Submitting an unchanged `endsAt` value preserves the represented API instant after local-time-to-ISO conversion.

## Acceptance Criteria

- [x] The edit modal converts a valid API `endsAt` instant into a browser-local `datetime-local` value instead of a UTC wall-clock value.
- [x] Invalid API date strings still prefill the input with an empty value.
- [x] Existing validation continues converting submitted timezone-less `datetime-local` values into ISO instants.
- [x] Focused tests cover timezone-offset-sensitive modal prefill behavior and unchanged-value round trips.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/MarketEventsView/components/MarketEventModalForm.tsx
react/src/pages/Dashboard/views/MarketEventsView/marketEventDateTime.ts
react/tests/pages/marketEventModal.test.tsx
```

## Constraints

- Do not change the consumed API schema or backend timezone semantics.
- Do not change the dashboard table date formatter.
- Do not change unrelated date-filter behavior.
- Do not alter market event lifecycle, pricing, scheduling, or mutation semantics.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern="MarketEventModalForm|validateMarketEventForm"
cd react && npm run lint
```

Fallback if the test runner does not support `--test-name-pattern` in the local Node version:

```bash
cd react && npm test
```

## Out of Scope

- Backend route, schema, persistence, or timezone changes
- Project-wide date-formatting changes
- Timezone-selection UI
- Unrelated table-filter date handling

## Completion Notes

- Added a market-event-local date helper that converts API instants into browser-local `datetime-local` values without changing the represented instant.
- Updated the edit modal to use the local-time helper while preserving existing validation submission behavior.
- Added forced `America/Sao_Paulo` coverage for local prefill and unchanged-value ISO round trips, plus invalid-date coverage.
- Validation passed with the defined full-suite fallback: `cd react && npm test`.
- Validation passed: `cd react && npm run lint` completed with seven pre-existing warnings in unrelated table components and no errors.
- Additional validation passed: `cd react && npm run build`.
