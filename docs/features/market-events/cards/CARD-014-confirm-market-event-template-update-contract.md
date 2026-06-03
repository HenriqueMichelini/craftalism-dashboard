---
id: CARD-014
feature: market-events
status: reverified
depends_on:
  - CARD-009
parallel_safe: true
---

# CARD-014: Confirm Market Event Template Update Contract

## Status

reverified

## Objective

Record the confirmed API-owned dashboard contract for updating market event templates.

## Context

Operators can list and create market event templates, but there is currently no confirmed update route for editing an existing template. Targeted API evidence shows `DashboardMarketEventTemplateController` exposes only `GET /api/dashboard/market/event-templates` and `POST /api/dashboard/market/event-templates`, and the current dashboard contract explicitly keeps template update controls out of scope.

`craftalism-api` now owns and documents an update route, request shape, response shape, authorization boundary, and validation semantics.

## Required Reading

- `../contract.md`
- `CARD-007-confirm-market-event-template-admin-contract.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/controller/DashboardMarketEventTemplateController.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/market/application/admin/MarketEventTemplateService.java`

- `../../../../../craftalism-api/docs/features/market-events/cards/CARD-029-add-dashboard-market-event-template-update-api.md`
- `../../../../../craftalism-api/docs/features/market-events/cards/CARD-030-document-dashboard-market-event-template-update-contract.md`

## Expected Behavior

The dashboard feature contract records the API-owned template update route, complete consumed update request and response shapes, authorization boundary, and dashboard ownership limits. It preserves the rule that the dashboard submits authored values but does not implement template validation, persistence, scheduler behavior, pricing behavior, or lifecycle semantics locally.

## Acceptance Criteria

- [ ] A confirmed API-owned update route for market event templates exists in `craftalism-api`.
- [ ] `docs/features/market-events/contract.md` records the confirmed method and path for updating a template.
- [ ] The contract records the complete consumed update request shape and API-returned template row shape.
- [ ] The contract records whether `templateId` is immutable during edit or can be changed through the update request.
- [ ] The contract records the `SCOPE_market:admin` boundary or the confirmed replacement authority.
- [ ] The contract removes or narrows the current blanket exclusion for market event template update controls without adding unsupported delete behavior.
- [ ] The contract states that dashboard code must not implement template validation, persistence, scheduler behavior, pricing behavior, or lifecycle semantics locally.

## Expected Files to Change

```text
docs/features/market-events/contract.md
docs/features/market-events/cards/CARD-014-confirm-market-event-template-update-contract.md
```

## Constraints

- Do not infer or invent an update route locally.
- Do not redefine API-owned validation, persistence, scheduler, pricing, blocking, or lifecycle behavior.
- Do not add template delete behavior.
- Do not expose dashboard BFF credentials or tokens to browser code.

## Validation Commands

```bash
rg -n "event-templates|MarketEventTemplate|update|PATCH|PUT|delete" docs/features/market-events/contract.md
```

Fallback if `rg` is unavailable:

```bash
grep -nE "event-templates|MarketEventTemplate|update|PATCH|PUT|delete" docs/features/market-events/contract.md
```

## Out of Scope

- Dashboard API client changes
- Dashboard modal or table implementation
- Backend route, schema, validation, persistence, scheduler, pricing, blocking, or lifecycle changes
- Market event template deletion

## Completion Notes

- Confirmed the API-owned `PUT
  /api/dashboard/market/event-templates/{templateId}` route and documented it
  in the dashboard market-events contract.
- Recorded the consumed update request shape as the authored template fields
  except `templateId`, with `templateId` path-bound and immutable.
- Recorded that list, create, and update responses use the API-owned template
  row shape, that all template admin routes require `SCOPE_market:admin`, and
  that delete behavior remains out of scope.
- Preserved the dashboard boundary: dashboard code may submit authored create
  and update requests but must not implement API-owned template validation,
  persistence, scheduler behavior, pricing behavior, or lifecycle semantics
  locally.
