# Workflow: Batch Orchestrator

## Purpose

Use this workflow to coordinate multiple cards, repositories, modules, or issues while respecting dependencies, scope boundaries, validation, and reverification.

The orchestrator coordinates work. It does not replace specialist workflows such as `implement-card.md`, `reverify-card.md`, `audit.md`, or `triage.md`.

## Required Steps

1. Read `AGENTS.md`.
2. Read `docs/index.md`.
3. Read `docs/context-policy.md`.
4. Read this workflow.
5. Identify each selected work unit.
6. Read relevant feature-local indexes when present.
7. Read selected card frontmatter and enough card body to understand scope.
8. Build a dependency graph.
9. Start only unblocked work units.
10. Require implementation, validation, and reverification before unblocking dependent cards.
11. Serialize work when dependency inference, file overlap, or behavior overlap is uncertain.

## Dependency Sources

Use card frontmatter as the canonical source for dependency metadata:

```yaml
id: CARD-001
feature: feature-name
status: planned
depends_on: []
parallel_safe: true
```

Feature-local indexes are execution guides only. If a feature-local index conflicts with card frontmatter, stop and report the conflict.

Card IDs are unique within a feature. The full card identity is `<feature>/<CARD-ID>`.

## Scheduling Rules

- Start only cards with no unresolved prerequisites.
- A prerequisite card unblocks dependents only when its `status` is `reverified`.
- Reverification is mandatory before unblocking dependents.
- Treat `parallel_safe: true` as a claim to verify, not permission to skip overlap checks.
- If `parallel_safe: false`, require an explanation in the card body and serialize the card.
- If two work units touch overlapping files or behavior, serialize unless the overlap is proven safe.
- If dependency inference is uncertain, prefer serialized execution.

## Blockers

Stop or block work when:

- required metadata is missing
- metadata conflicts with the card body
- feature-local index conflicts with card frontmatter
- a prerequisite card is missing
- a prerequisite card is not `reverified`
- validation fails
- implementation is partial
- changed files include adjacent-card or dependent-card scope
- file or behavior overlap is unsafe for parallel execution

## Metadata Problems

The orchestrator should report metadata problems. Do not automatically modify cards or indexes unless the user explicitly asks for a planning or documentation update.

## Worker Instructions

Each worker must receive:

- assigned work unit
- required specialist workflow and skill
- prerequisite status
- allowed scope
- forbidden adjacent-card scope
- validation expectations
- reverification requirement
- final report expectations

## Dependency Status Values

Use one of:

- `Independent - started immediately`
- `Blocked - waiting for <feature>/<CARD-ID>`
- `Unblocked - started after <feature>/<CARD-ID> was reverified`
- `Blocked - prerequisite failed validation or reverification`
- `Serialized - overlapping files or behavior`
- `Blocked - metadata conflict`

## Final Batch Report

State:

- work units
- dependency graph
- execution order
- workers started immediately
- workers blocked
- workers unblocked later
- completed work
- failed or blocked work
- validation summary
- reverification summary
- overall verdict
