---
id: CARD-007
feature: market-events
status: reverified
depends_on: []
parallel_safe: false
---

# CARD-007: Confirm Market Event Template Admin Contract

## Status

reverified

## Objective

Document the confirmed API-owned dashboard contract for listing and creating market event templates.

## Context

`craftalism-api` now exposes protected dashboard/admin template routes. The dashboard market-events contract currently covers event instances only, so template route usage, response fields, create fields, authorization, and ownership boundaries must be recorded before frontend implementation begins.

This card is not parallel-safe with other market-events contract work because it updates the shared feature contract.

## Required Reading

- `../contract.md`
- `../../../../../craftalism-api/docs/features/market-events/cards/CARD-022-add-dashboard-market-event-template-api.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/controller/DashboardMarketEventTemplateController.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventTemplateCreateRequestDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketEventTemplateResponseDTO.java`

## Expected Behavior

The dashboard feature contract records the API-owned `GET` and `POST` template routes, complete consumed request and response shapes, `SCOPE_market:admin` boundary, dashboard-owned visualization and create-form responsibilities, and explicit exclusions for backend semantics and unsupported mutation operations.

## Acceptance Criteria

- [ ] `docs/features/market-events/contract.md` records `GET /api/dashboard/market/event-templates` for listing templates.
- [ ] The contract records `POST /api/dashboard/market/event-templates` for creating templates and the API-returned created template row.
- [ ] The contract records the complete consumed template create request and response fields from the API DTOs.
- [ ] The contract records that both routes require the API-owned `SCOPE_market:admin` authority and that browser code must not hold dashboard BFF credentials.
- [ ] The contract states that dashboard code may visualize and submit templates but must not implement template validation, persistence, scheduler behavior, pricing behavior, or lifecycle semantics locally.
- [ ] The contract states that update and delete template operations are out of scope because no confirmed API routes exist for them.

## Expected Files to Change

```text
docs/features/market-events/contract.md
docs/features/market-events/cards/CARD-007-confirm-market-event-template-admin-contract.md
```

## Constraints

- Do not change frontend source or tests in this card.
- Do not redefine API-owned template semantics locally.
- Do not invent update, delete, enable, disable, preview, or scheduling routes.
- Preserve the existing event-instance contract.

## Validation Commands

```bash
rg -n "event-templates|MarketEventTemplate|SCOPE_market:admin|update|delete" docs/features/market-events/contract.md
```

## Out of Scope

- Frontend API client implementation
- Template table or create form implementation
- Deployment BFF route forwarding
- Backend template behavior or authorization changes

## Completion Notes

- Recorded the confirmed API-owned market event template list and create routes.
- Documented the complete consumed template request and response shapes, the
  `SCOPE_market:admin` boundary, browser credential exclusion, dashboard
  ownership limits, and unsupported update/delete operations.
- Validation and reverification: the card `rg` command passed.
