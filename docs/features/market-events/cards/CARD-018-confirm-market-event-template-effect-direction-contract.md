---
id: CARD-018
feature: market-events
status: reverified
depends_on:
  - CARD-007
parallel_safe: true
---

# CARD-018: Confirm Market Event Template Effect Direction Contract

## Status

reverified

## Objective

Confirm whether market event template `effectDirection` is independently authored or derivable from the minimum and maximum effect basis-point values.

## Context

The market event template modal currently asks operators to provide `Minimum Effect Basis Points`, `Maximum Effect Basis Points`, and `Effect Direction`. This can be redundant or contradictory if the API-owned meaning is that effect basis points alone determine direction, for example values above `10000` for upward effects, `10000` for no price change or blocking, and values below `10000` for downward effects.

The dashboard currently consumes `effectDirection` as a required API-owned create field and renders only the API-confirmed `UP`, `DOWN`, and `BLOCK` options. Before the dashboard removes, derives, disables, or consistency-validates this field, the API-owned template semantics must be confirmed in the shared feature contract.

## Required Reading

- `../contract.md`
- `CARD-007-confirm-market-event-template-admin-contract.md`
- `CARD-010-replace-template-effect-direction-input-with-select.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/market/application/admin/MarketEventTemplateService.java`

## Expected Behavior

The market-events feature contract records the confirmed API-owned relationship between `effectDirection`, `minEffectBasisPoints`, `maxEffectBasisPoints`, and blocking/no-change behavior. It states whether the dashboard must continue to author `effectDirection` explicitly, may derive it from the basis-point range, or should present it as read-only/derived while still sending the API-required request field.

## Acceptance Criteria

- [ ] API evidence confirms whether `effectDirection` is independently meaningful or derivable from `minEffectBasisPoints` and `maxEffectBasisPoints`.
- [ ] API evidence confirms how `10000` basis points relates to `UP`, `DOWN`, `BLOCK`, no-change, and blocking behavior.
- [ ] `docs/features/market-events/contract.md` records the confirmed consumed semantics without redefining backend validation locally.
- [ ] The contract records the dashboard-owned UI implication: keep explicit selector, derive the submitted field, or display a derived/read-only value.
- [ ] The contract preserves the API-owned create request shape unless the API contract itself changes.
- [ ] A follow-up dashboard implementation card is created only if the confirmed contract supports changing the template modal UX.

## Expected Files to Change

```text
docs/features/market-events/contract.md
docs/features/market-events/cards/CARD-018-confirm-market-event-template-effect-direction-contract.md
```

## Constraints

- Do not change dashboard source code in this card.
- Do not change API source code in this repository.
- Do not infer pricing, blocking, scheduler, lifecycle, or persistence behavior without API evidence.
- Do not remove `effectDirection` from the dashboard request shape unless the API-owned contract changes.
- Do not create a dashboard implementation card until the contract records the confirmed UI implication.

## Validation Commands

```bash
rg -n "effectDirection|Effect Direction|minEffectBasisPoints|maxEffectBasisPoints|10000|BLOCK|UP|DOWN" docs/features/market-events/contract.md docs/features/market-events/cards/CARD-018-confirm-market-event-template-effect-direction-contract.md
```

Fallback if `rg` is unavailable:

```bash
grep -nE "effectDirection|Effect Direction|minEffectBasisPoints|maxEffectBasisPoints|10000|BLOCK|UP|DOWN" docs/features/market-events/contract.md docs/features/market-events/cards/CARD-018-confirm-market-event-template-effect-direction-contract.md
```

## Out of Scope

- Dashboard template modal implementation changes
- Dashboard tests for derived effect direction behavior
- Backend validation, pricing, blocking, scheduler, lifecycle, or persistence changes
- API request-schema changes unless confirmed separately in `craftalism-api`
- Market event instance modal changes

## Completion Notes

- Confirmed from `MarketEventTemplateService` that `effectDirection` remains an
  independently authored API-owned field in template create and update
  requests.
- Recorded the API-owned basis-point relationship: `UP` requires values above
  `10000`, `DOWN` requires values below `10000`, and `BLOCK` requires neutral
  `10000` basis points plus the API-owned blocking/manual/item/rarity
  invariants.
- Recorded the dashboard UI implication: keep the explicit `Effect Direction`
  selector and submit the selected API-confirmed value without deriving,
  disabling, or locally consistency-validating it from basis-point fields.
- No follow-up dashboard implementation card is needed because the current
  selector behavior remains the confirmed UI.
