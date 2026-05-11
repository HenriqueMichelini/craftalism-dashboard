# Workflow: Refactor

## Purpose

Use this workflow for behavior-preserving structural changes.

## Required Steps

1. Read `AGENTS.md`.
2. Read `docs/index.md`.
3. Read `docs/context-policy.md`.
4. Read this workflow.
5. Read `docs/conventions.md`.
6. Read `docs/architecture/boundaries.md` if boundaries may be affected.
7. Identify affected source and test files.
8. State the behavior that must remain unchanged.
9. Apply the smallest safe refactor.
10. Run validation.

## Refactor Rules

- Preserve externally observable behavior.
- Do not combine refactoring with feature work.
- Do not change public contracts unless explicitly required.
- Do not move responsibilities across boundaries without updating architecture docs.

## Report Format

State:

- refactor goal
- behavior preserved
- files changed
- validation result
- risks or follow-ups
