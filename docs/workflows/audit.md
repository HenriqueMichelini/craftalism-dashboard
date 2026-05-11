# Workflow: Audit

## Purpose

Use this workflow to perform a bounded, read-only audit of a repository area for correctness, design, build, documentation, or quality issues.

Audits produce findings and recommended cards. They do not implement fixes directly.

## Required Steps

1. Read `AGENTS.md`.
2. Read `docs/index.md`.
3. Read `docs/context-policy.md`.
4. Read this workflow.
5. Declare the audit target and selected context.
6. Inspect only source, tests, configuration, and docs directly related to the audit target.
7. Report confirmed problems with evidence.
8. Recommend cards for confirmed implementation work.

## Scope Declaration

Before auditing, state:

- audit target
- selected workflow or routed context
- selected context files
- behavior, contract, or rule being checked
- source, test, config, or docs likely to inspect
- validation or evidence checks
- out-of-scope items

## Rules

- Audits are read-only.
- Report only confirmed problems supported by local evidence.
- Put uncertain items under hypotheses or optional improvements.
- Do not broaden into unrelated features, modules, or docs.
- Do not redefine public contracts.
- Do not modify source, tests, or docs.
- If implementation is needed, recommend a card.

## Report Format

State:

- scope declaration
- evidence reviewed
- confirmed problems
- hypotheses or optional improvements
- minimal fix scope
- cards recommended
- out-of-scope items
