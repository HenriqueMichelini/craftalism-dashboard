---
id: CARD-020
feature: market-events
status: planned
depends_on:
  - CARD-019
parallel_safe: true
---

# CARD-020: Remove Rarity From Dashboard Market Event Models

## Status

planned

## Objective

Update dashboard TypeScript models and API-level tests to consume rarity-free market event and template payloads.

## Context

After the API-owned contract removes rarity, the dashboard local models must stop requiring or accepting `rarity` on market event templates and market event rows. This card prepares the dashboard API boundary before view-specific cleanup.

## Required Reading

- `../contract.md`
- `CARD-019-confirm-market-event-rarity-removal-contract.md`
- `react/src/types/models/marketEvent.types.ts`
- `react/src/types/models/marketEventTemplate.types.ts`
- `react/tests/api/marketEvents.test.ts`
- `react/tests/api/marketEventTemplates.test.ts`

## Expected Behavior

Dashboard model types no longer define `MarketEventRarity` or `rarity` fields. API tests use rarity-free fixture payloads for market event rows and market event templates while preserving route usage, request bodies, id normalization, and backend result order.

## Acceptance Criteria

- [ ] `MarketEventRarity` is removed from dashboard type definitions.
- [ ] `MarketEvent` no longer contains `rarity`.
- [ ] `MarketEventTemplateCreateRequest`, `MarketEventTemplateUpdateRequest`, and `MarketEventTemplate` no longer contain `rarity`.
- [ ] Market event API tests use rarity-free response fixtures and still verify id normalization and result order.
- [ ] Market event template API tests use rarity-free create/update requests and response fixtures.
- [ ] No dashboard API client adds, maps, derives, or fabricates rarity.

## Expected Files to Change

```text
react/src/types/models/marketEvent.types.ts
react/src/types/models/marketEventTemplate.types.ts
react/tests/api/marketEvents.test.ts
react/tests/api/marketEventTemplates.test.ts
```

## Constraints

- Do not change modal, table, or page UX in this card except where required by type compilation in API-level tests.
- Do not change API route paths or mutation methods.
- Do not introduce a replacement rarity-like field.
- Do not derive rarity from `automaticWeight` or any other field.

## Validation Commands

```bash
cd react && npm test -- --test-name-pattern="marketEvents|marketEventTemplates"
```

Fallback if the focused pattern is unsupported:

```bash
cd react && npm test
```

## Out of Scope

- API-owned schema, migration, scheduler, validation, persistence, or DTO changes
- Market event template modal or table cleanup
- Market event instance view cleanup
- Documentation updates beyond implementation completion notes

## Completion Notes

