---
id: CARD-001
feature: dashboard-client
status: implemented
depends_on: []
parallel_safe: true
---

# CARD-001: Accept Version-Agnostic Player UUIDs

## Status

implemented

## Objective

Align dashboard player creation validation with the API contract by accepting canonical UUID values regardless of version.

## Context

The player modal currently accepts only UUIDv7 values. The consumed API contract accepts any valid UUID version, and Minecraft player UUIDs may use versions other than UUIDv7.

## Required Reading

- `../contract.md`
- `../../../../craftalism-api/docs/features/dashboard-crud-api/contract.md`

## Expected Behavior

The player create modal accepts canonical UUID strings including UUIDv3, UUIDv4, and UUIDv7, while continuing to reject malformed values and duplicate player UUIDs.

## Acceptance Criteria

- [ ] Player form validation accepts canonical UUIDv3, UUIDv4, and UUIDv7 values.
- [ ] Player form validation rejects malformed and non-canonical UUID values.
- [ ] The validation error message does not claim that UUIDv7 is required.
- [ ] Existing required-field, duplicate UUID, name, and edit-mode behavior remains unchanged.
- [ ] Focused tests cover accepted UUID versions and malformed UUID rejection.

## Expected Files to Change

```text
react/src/pages/Dashboard/views/PlayersView/playerValidation.ts
react/tests/pages/playerModal.test.tsx
```

## Constraints

- Do not change API or database behavior.
- Do not require a specific UUID version.
- Do not change player UUID immutability or duplicate detection.
- Do not modify unrelated dashboard forms or resource behavior.

## Validation Commands

```bash
cd react
npm run test -- --test-name-pattern='UUID|uuid'
npm run lint
npm run test
npm run build
```

If the targeted test-name command is unsupported, run `npm run test` as the fallback.

## Out of Scope

- API or database changes
- Minecraft UUID generation
- Player UUID normalization beyond trimming surrounding whitespace
- UUID validation changes outside the player create/edit modal

## Completion Notes

Replaced UUIDv7-only player form validation with version-agnostic canonical UUID
validation. Added focused coverage for UUIDv3, UUIDv4, UUIDv7, and malformed
UUID values.

Validation:

- `npm run test -- --test-name-pattern='UUID|uuid'` was unsupported by the
  package test script argument order, so the documented fallback was used.
- `npm run test` passed.
- `npm run lint` passed with seven pre-existing Tailwind warnings.
- `npm run build` passed.
