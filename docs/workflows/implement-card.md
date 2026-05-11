# Workflow: Implement Card

## Purpose

Use this workflow to implement one selected card.

## Required Steps

1. Read `AGENTS.md`.
2. Read `docs/index.md`.
3. Read `docs/context-policy.md`.
4. Read this workflow.
5. Read the selected card.
6. Read the selected feature contract.
7. Check dependency readiness from card frontmatter.
8. Read additional documents only if routed by the card or required by context policy.
9. Inspect directly affected source and test files.
10. Declare scope before implementation.
11. Implement the smallest complete change.
12. Run validation commands.
13. Update completion notes and set card status to `implemented` only if implementation succeeds.

## Card Readiness Check

Before implementation, verify that the selected card has:

- frontmatter fields: `id`, `feature`, `status`, `depends_on`, `parallel_safe`
- objective
- expected behavior
- acceptance criteria
- expected files or source areas
- validation commands
- out-of-scope items

If any required section is empty, stop before implementation.

If validation commands cannot run, report why and use only the nearest safe fallback if one is defined.

If the selected card path does not exist, stop before implementation and follow `docs/context-policy.md`.

Card IDs are unique within a feature. The full card identity is `<feature>/<CARD-ID>`.

## Dependency Readiness Check

Before implementation:

- If `depends_on` is empty, record dependency status as independent.
- If `depends_on` lists prerequisite cards, read each prerequisite card.
- A prerequisite card unblocks this card only when its `status` is `reverified`.
- If any prerequisite is missing, incomplete, not `reverified`, or conflicts with this card, stop before implementation.
- If this workflow is running under an orchestrator, return dependency status instead of implementing blocked work.
- If `parallel_safe: false`, confirm the card body explains why before implementation.

Dependency checks do not replace orchestration. For multi-card work, use `docs/workflows/batch-orchestrator.md`.

## Scope Declaration Format

Before implementation, state:

- selected card
- dependency status
- prerequisite cards reviewed, if any
- parallelization status
- ownership classification
- expected behavior
- selected context files
- files likely to change
- validation commands
- out-of-scope items

## Implementation Rules

- Keep the change focused on the card.
- Do not perform unrelated refactors.
- Do not implement adjacent, dependent, or prerequisite card scope.
- Do not change public contracts unless the card requires it.
- Do not update unrelated documentation.
- Preserve existing behavior unless acceptance criteria require a change.
- If implementation reveals additional work, report a follow-up card instead of expanding scope.
- If another feature or repository must be changed, stop unless the selected card explicitly allows it.
- If public contracts must change, stop unless the selected card explicitly allows it.

## Completion Report Format

After implementation, state:

- files changed
- behavior changed
- tests or checks run
- validation result
- unresolved risks
- follow-up cards needed, if any
