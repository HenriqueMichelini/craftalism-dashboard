---
id: CARD-008
feature: market-events
status: reverified
depends_on:
  - CARD-007
parallel_safe: true
---

# CARD-008: Add Market Event Template Admin Client

## Status

reverified

## Objective

Add dashboard-local market event template types and API client methods for the confirmed admin list and create routes.

## Context

After `CARD-007` records the consumed API contract, the dashboard needs a centralized typed client before a template management view can be built.

## Required Reading

- `../contract.md`
- `CARD-007-confirm-market-event-template-admin-contract.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventTemplateCreateRequestDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventTemplateResponseDTO.java`

## Expected Behavior

A centralized template API module exposes typed `getAll()` and `create(request)` methods for `/api/dashboard/market/event-templates` and returns API-owned template rows without deriving backend semantics locally.

## Acceptance Criteria

- [ ] Local types model the complete template row and create request fields documented by `CARD-007`.
- [ ] `marketEventTemplatesApi.getAll()` calls `GET /api/dashboard/market/event-templates`.
- [ ] `marketEventTemplatesApi.create(request)` calls `POST /api/dashboard/market/event-templates` with the authored request body.
- [ ] The API client preserves the backend list order.
- [ ] No update or delete client method is added.
- [ ] API tests cover list route usage, create method and body, returned row consumption, and the absence of speculative mutation routes.

## Expected Files to Change

```text
react/src/api/endpoints/marketEventTemplates.ts
react/src/types/models/marketEventTemplate.types.ts
react/tests/api/marketEventTemplates.test.ts
```

## Constraints

- Do not add UI in this card.
- Do not calculate template eligibility, scheduler decisions, effect ranges, blocking behavior, pricing behavior, or lifecycle state locally.
- Do not introduce dashboard authentication, token acquisition, browser persistence, update, delete, filtering, sorting, pagination, or detail routes.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern=marketEventTemplates
```

Fallback if the test runner does not support `--test-name-pattern` in the local Node version:

```bash
cd react && npm test
```

## Out of Scope

- Template management view
- Template create form
- Deployment BFF route forwarding
- Backend route, schema, validation, persistence, scheduler, pricing, blocking, or lifecycle changes

## Completion Notes

- Added typed market event template row and create-request models.
- Added centralized `getAll()` and `create(request)` client methods for the
  confirmed admin template route without speculative mutation methods.
- Added focused API coverage for route usage, list order, create body, returned
  rows, and the absence of update/delete methods.
- Validation and reverification: `cd react && npm test --
  --test-name-pattern=marketEventTemplates` passed.
