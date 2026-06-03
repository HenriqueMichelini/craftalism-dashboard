---
id: CARD-019
feature: market-events
status: planned
depends_on:
  - CARD-018
parallel_safe: true
---

# CARD-019: Confirm Market Event Rarity Removal Contract

## Status

planned

## Objective

Record the confirmed API-owned contract after `rarity` is fully removed from market event templates and event instances.

## Context

Market event template rarity currently overlaps with automatic scheduling fields such as `automaticEnabled` and `automaticWeight`. The approved product direction is to remove rarity entirely instead of preserving a separate authored or persisted bucket.

This is a dashboard contract-confirmation card only. The schema, persistence, scheduler, validation, DTO, and migration work belongs to `craftalism-api`.

## Required Reading

- `../contract.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventTemplateCreateRequestDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventTemplateUpdateRequestDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventTemplateResponseDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventAdminResponseDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/model/MarketEventTemplate.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/model/MarketEventInstance.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/market/domain/event/MarketEventSelectionPolicy.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/market/application/admin/MarketEventTemplateService.java`

## Expected Behavior

The dashboard market-events contract no longer lists `rarity` in market event template create/update requests, template responses, market event rows, or expected dashboard display behavior. The contract records that scheduling probability and eligibility are represented by explicit API-owned fields and rules, not by a rarity bucket.

## Acceptance Criteria

- [ ] API evidence confirms `rarity` is removed from market event template create, update, and response DTOs.
- [ ] API evidence confirms `rarity` is removed from market event admin response rows.
- [ ] API evidence confirms `rarity` is removed from `MarketEventTemplate` and `MarketEventInstance` persistence/domain models, including any required migration.
- [ ] API evidence confirms scheduler and template validation no longer branch on rarity and instead use explicit fields such as `automaticEnabled`, `automaticWeight`, `blockingAllowed`, cooldowns, scopes, and effect ranges.
- [ ] `docs/features/market-events/contract.md` removes rarity from consumed request and response shapes.
- [ ] `docs/features/market-events/contract.md` removes rarity display requirements and records that the dashboard must not derive or fabricate rarity locally.
- [ ] Follow-up dashboard implementation cards remain scoped to consuming the confirmed API contract, not redefining API domain semantics.

## Expected Files to Change

```text
docs/features/market-events/contract.md
docs/features/market-events/cards/CARD-019-confirm-market-event-rarity-removal-contract.md
```

## Constraints

- Do not change dashboard source code in this card.
- Do not change API source code in this repository.
- Do not derive rarity locally from automatic weight, cooldown, scope, effect range, or blocking rules.
- Do not preserve a display-only rarity label unless a new API-owned field explicitly replaces it.
- Do not update dashboard models before the API-owned contract evidence is confirmed.

## Validation Commands

```bash
rg -n "rarity|MarketEventRarity|automaticWeight|MarketEventTemplate|MarketEvent =|Market Event Row" docs/features/market-events/contract.md docs/features/market-events/cards/CARD-019-confirm-market-event-rarity-removal-contract.md
```

Fallback if `rg` is unavailable:

```bash
grep -nE "rarity|MarketEventRarity|automaticWeight|MarketEventTemplate|MarketEvent =|Market Event Row" docs/features/market-events/contract.md docs/features/market-events/cards/CARD-019-confirm-market-event-rarity-removal-contract.md
```

## Out of Scope

- API schema, migration, scheduler, validation, persistence, or DTO implementation
- Dashboard source or test changes
- Replacing rarity with a different bucket field
- Market pricing, quote, trade, drift, lifecycle, auth, or permissions changes

## Completion Notes

