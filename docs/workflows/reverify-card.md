# Workflow: Reverify Card

## Purpose

Use this workflow to verify whether a completed implementation satisfies its card, contract, and validation criteria.

## Required Steps

1. Read `AGENTS.md`.
2. Read `docs/index.md`.
3. Read `docs/context-policy.md`.
4. Read this workflow.
5. Read the selected card.
6. Read the selected feature contract.
7. Check dependency metadata and prerequisite evidence when present.
8. Inspect changed files and related tests.
9. Run or review validation commands.
10. If reverification passes and status recording is in scope, update only the selected card status to `reverified`.
11. Report whether the implementation passes, fails, or is partially verified.

## Verification Scope

Check:

- acceptance criteria
- dependency metadata was respected
- prerequisite cards were completed before this card when `depends_on` is not empty
- feature contract compliance
- architecture boundary compliance, if relevant
- test coverage
- validation output
- unintended unrelated changes
- implementation did not include adjacent, prerequisite, or dependent card scope
- feature-local `index.md` remains consistent, if present

Reverification is mandatory before a card can unblock dependents. A dependent card can start only after each prerequisite card has `status: reverified`.

## Report Format

State:

- selected card
- dependency status
- prerequisite evidence reviewed, if any
- adjacent/dependent card scope check
- expected behavior
- evidence reviewed
- validation commands/results
- pass/fail status
- issues found
- required fixes, if any

## Rule

Do not modify source or test files during reverification unless explicitly asked.

Do not update unrelated cards or indexes. If status recording is in scope, only the selected card may be updated to `reverified`, and only after reverification passes.

If the selected card path does not exist, stop before reverification and follow `docs/context-policy.md`.
