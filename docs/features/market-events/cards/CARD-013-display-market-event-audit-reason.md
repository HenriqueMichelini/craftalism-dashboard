---
id: CARD-013
feature: market-events
status: reverified
depends_on:
  - CARD-005
parallel_safe: false
---

# CARD-013: Display Market Event Audit Reason

## Status

reverified

## Objective

Expose the API-returned market event audit reason in the dashboard edit modal so operators can verify why an event was updated, cancelled, or superseded.

## Context

Market event mutation requests already submit an optional free-text `reason`. The API stores that value inside the internal `auditMetadata` JSON string, while `endReason` remains the lifecycle enum `EXPIRED`, `CANCELLED`, or `SUPERSEDED`. The dashboard currently preserves `auditMetadata` in its local row type but does not render it, which makes a successfully stored operator reason appear to be lost.

This card is not parallel-safe with other market event modal work because it changes the same edit modal and focused test file.

## Required Reading

- `../contract.md`
- `CARD-005-add-market-event-create-edit-modal.md`
- `../../../../../craftalism-api/docs/features/market-events/contract.md`

## Expected Behavior

Opening an existing market event in edit mode shows its latest API-returned audit reason as read-only operator metadata. Missing, malformed, or reason-less audit metadata renders a neutral fallback without breaking the modal. The editable `Reason` field continues to represent the next mutation reason and remains separate from the persisted lifecycle `endReason`.

## Acceptance Criteria

- [x] The edit modal renders a read-only `Latest Audit Reason` value derived from the row's API-returned `auditMetadata`.
- [x] Valid JSON audit metadata with a string `reason` displays that reason without treating `endReason` as free text.
- [x] Missing, malformed, empty, or non-string audit reasons render a neutral placeholder.
- [x] The create modal does not render prior audit metadata.
- [x] The editable `Reason` field remains empty when opening edit mode and continues to submit only the next mutation reason.
- [x] Tests cover a saved update reason, missing metadata, malformed metadata, and create-mode omission.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/MarketEventsView/components/MarketEventModalForm.tsx
react/src/pages/Dashboard/views/MarketEventsView/marketEventAudit.ts
react/tests/pages/marketEventModal.test.tsx
```

## Constraints

- Do not change the market event API response schema.
- Do not parse audit metadata with ad hoc string manipulation; use JSON parsing with a fallback.
- Do not treat `endReason` as an operator-entered reason.
- Do not expose internal audit metadata through public `/api/market/**` routes.
- Do not add a broad event detail page or audit-history UI.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern="MarketEventModalForm|marketEvent"
```

Fallback if the test runner does not support `--test-name-pattern` in the local Node version:

```bash
cd react && npm test
```

## Out of Scope

- Backend DTO, persistence, lifecycle, scheduler, pricing, or audit changes
- Full audit-history display
- Public active-event snapshot display or public event history
- Dashboard authentication rollout

## Completion Notes

- Added a JSON-based audit metadata parser with a neutral `Not provided` fallback for missing, malformed, empty, and non-string reasons.
- Rendered the latest persisted audit reason read-only in edit mode while leaving the editable next-mutation `Reason` field empty.
- Validation passed: `cd react && npm test -- --test-name-pattern="MarketEventModalForm|marketEvent"` completed with 22 passing compiled test files.
