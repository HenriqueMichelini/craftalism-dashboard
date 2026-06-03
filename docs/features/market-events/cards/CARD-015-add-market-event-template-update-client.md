---
id: CARD-015
feature: market-events
status: reverified
depends_on:
  - CARD-014
parallel_safe: true
---

# CARD-015: Add Market Event Template Update Client

## Status

reverified

## Objective

Add a typed dashboard API client method for the confirmed market event template update route.

## Context

The existing dashboard template client exposes only `getAll()` and `create(request)` because update behavior was previously unconfirmed. After `CARD-014` records the consumed API update contract, the dashboard needs centralized route usage and request typing before UI work can submit edits.

## Required Reading

- `../contract.md`
- `CARD-014-confirm-market-event-template-update-contract.md`

## Expected Behavior

`marketEventTemplatesApi` exposes a typed update method that calls only the route recorded by `CARD-014`, sends the confirmed request body, and returns the API-owned template row. The client continues to avoid speculative delete, enable, disable, preview, scheduler, and lifecycle methods.

## Acceptance Criteria

- [ ] Local types model the complete update request shape recorded by `CARD-014`.
- [ ] `marketEventTemplatesApi.update(...)` calls the confirmed update method and path from `CARD-014`.
- [ ] The update client serializes the confirmed authored update request body without adding local domain semantics.
- [ ] The update client returns the API-owned `MarketEventTemplate` row.
- [ ] Existing `getAll()` and `create(request)` behavior is preserved.
- [ ] Tests cover update route construction, HTTP method, request serialization, response handling, and continued absence of unsupported delete behavior.

## Expected Files to Change

```text
react/src/api/endpoints/marketEventTemplates.ts
react/src/types/models/marketEventTemplate.types.ts
react/tests/api/marketEventTemplates.test.ts
```

## Constraints

- Do not implement or call update behavior before `CARD-014` confirms the API-owned route and request shape.
- Do not add template delete, enable, disable, preview, scheduling, or lifecycle client methods.
- Do not calculate template validation, scheduler decisions, effect behavior, blocking behavior, pricing behavior, or lifecycle state locally.
- Do not expose dashboard BFF credentials or tokens to browser code.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern="marketEventTemplatesApi|MARKET_EVENT_TEMPLATES_ENDPOINT"
cd react && npm run build
```

Fallback if the test runner does not support `--test-name-pattern` in the local Node version:

```bash
cd react && npm test
cd react && npm run build
```

## Out of Scope

- Template modal or table edit controls
- Contract confirmation
- Backend route, schema, validation, persistence, scheduler, pricing, blocking, or lifecycle changes
- Market event template deletion

## Completion Notes

- Added `MarketEventTemplateUpdateRequest` as the authored template fields
  except immutable `templateId`.
- Added `marketEventTemplatesApi.update(templateId, request)` using `PUT
  /api/dashboard/market/event-templates/{templateId}` with URL-encoded
  path-bound identity and the confirmed serialized request body.
- Preserved existing list/create behavior and kept unsupported delete behavior
  absent.
- Validation: `npm test -- --test-name-pattern="marketEventTemplatesApi|MARKET_EVENT_TEMPLATES_ENDPOINT"`
  and `npm run build` passed from `react/`.
