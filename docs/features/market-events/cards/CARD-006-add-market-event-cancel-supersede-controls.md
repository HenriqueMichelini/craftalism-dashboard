---
id: CARD-006
feature: market-events
status: reverified
depends_on:
  - CARD-005
parallel_safe: false
---

# CARD-006: Add Market Event Cancel And Supersede Controls

## Status

reverified

## Objective

Add audited cancel and supersede controls for market events using the confirmed API-owned admin mutation routes.

## Context

The backend exposes cancel and supersede as event-admin mutations. There is no hard-delete route for market events, so dashboard removal semantics must be represented as cancellation and must preserve the API-returned row.

## Required Reading

- `../contract.md`
- `CARD-003-confirm-market-events-admin-mutation-contract.md`
- `CARD-004-add-market-events-admin-mutation-client.md`
- `CARD-005-add-market-event-create-edit-modal.md`
- `../../../../../craftalism-api/docs/features/market-events/handoff.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/controller/DashboardMarketEventAdminController.java`

## Expected Behavior

Operators can cancel an event with a reason and can supersede the active event with a replacement event. Both flows show explicit warning/confirmation UX, call the API-owned mutation route, and update table rows only from API responses.

## Acceptance Criteria

- [x] The event edit modal exposes a cancel action for cancellable rows and labels it as cancellation, not deletion.
- [x] Cancel requires explicit confirmation and captures an optional reason before submitting `marketEventsApi.cancel(id, { reason })`.
- [x] Cancel success replaces the affected row with the API-returned cancelled row and preserves backend result ordering as closely as the local update helper allows until the next refetch.
- [x] The Market Events view exposes a `Supersede Active Event` action using the create/start form fields plus reason, submitted through `marketEventsApi.supersede()`.
- [x] Supersede UI warns that the active event will be ended with API-owned `SUPERSEDED` semantics, without calculating or selecting the active event locally.
- [x] Supersede success adds or updates the API-returned replacement row and refreshes the table so the superseded prior row state comes from the backend.
- [x] Duplicate cancel and supersede submissions are prevented while requests are in flight.
- [x] API errors remain visible in the relevant modal/control and do not mutate local rows.
- [x] Tests cover cancel confirmation, cancel request payload, cancel success row replacement, cancel error handling, supersede request payload, supersede success refresh, and duplicate-submit prevention.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/MarketEventsView/MarketEventsView.tsx
react/src/pages/Dashboard/views/MarketEventsView/components/MarketEventModalForm.tsx
react/src/pages/Dashboard/views/MarketEventsView/marketEventRows.ts
react/tests/pages/marketEventModal.test.tsx
react/tests/pages/marketEventsView.test.tsx
```

## Constraints

- Do not add a hard-delete event control or call a `DELETE` route.
- Do not infer active-event selection, lifecycle transitions, superseded row state, pricing impact, drift, blocking effect, scheduler decisions, or audit metadata locally.
- Do not expose admin metadata through public `/api/market/**` routes.
- Do not introduce dashboard authentication, token acquisition, browser persistence, API-backed filtering, sorting, pagination, or detail pages.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern="MarketEvents|marketEvent"
```

Fallback if the test runner does not support `--test-name-pattern` in the local Node version:

```bash
cd react && npm test
```

## Out of Scope

- Event hard delete
- Backend route, schema, validation, lifecycle, scheduler, pricing, drift, blocking, quote, or audit changes
- Dashboard authentication rollout
- Public active-event snapshot display or public event history

## Completion Notes

- Added an active-row cancellation control with explicit confirmation and optional audit reason submission through the API-owned cancel route.
- Added a create-style `Supersede Active Event` modal with API-authority warning, replacement-row upsert, and backend refresh for authoritative prior-row state.
- Reused the modal submission guard for cancel and supersede errors and duplicate-submit prevention.
- Validation passed: `cd react && npm test -- --test-name-pattern="MarketEvents|marketEvent"` completed with 22 passing compiled test files.
