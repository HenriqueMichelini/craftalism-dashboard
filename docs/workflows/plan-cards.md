# Workflow: Plan Cards

## Purpose

Use this workflow to split confirmed evidence or an approved plan into ready implementation cards.

Planning creates or updates cards only. Do not modify source, tests, runtime configuration, commits, or branches.

## Required Steps

1. Read `AGENTS.md`.
2. Read `docs/index.md`.
3. Read `docs/context-policy.md`.
4. Read this workflow.
5. Read the relevant feature contract, if one exists.
6. Inspect only evidence needed to size and scope the cards.
7. Create small cards with explicit acceptance criteria.
8. Add required dependency frontmatter to each card.
9. Update the feature-local `index.md` only when the feature has multiple cards.

## Valid Inputs

Create cards only from:

- confirmed audit findings
- bounded triage results with concrete evidence
- user-approved implementation plans
- user-selected confirmed issues
- PR review or CI evidence with enough detail to become implementation scope

If the input is vague, broad, speculative, missing evidence, or missing approval, stop and report what is needed before cards can be written.

## Card Metadata

Every implementation card must start with this frontmatter:

```yaml
---
id: CARD-001
feature: feature-name
status: planned
depends_on: []
parallel_safe: true
---
```

Card IDs are unique within a feature. The full card identity is `<feature>/<CARD-ID>`.

Use `depends_on` for prerequisite cards in the same feature unless cross-feature work is explicitly scoped.

Use `parallel_safe: false` when the card must not run concurrently with sibling work. Explain the reason in the card body.

## Status Values

Use these card status values:

- `planned`
- `in_progress`
- `implemented`
- `reverified`
- `blocked`
- `deferred`

Reverification is mandatory by workflow rule. A prerequisite card unblocks dependents only when its status is `reverified`.

## Card Sizing

Split cards when work involves:

- unrelated modules
- unrelated behavior changes
- unrelated contracts
- separate validation paths
- separate runtime concerns
- separate architectural decisions
- different ownership boundaries
- public-contract changes plus internal implementation
- changes that could be committed independently

Do not combine feature work, refactoring, and documentation updates unless the documentation describes the same implemented behavior and belongs in the selected card scope.

## Feature-Local Index

For multi-card features, create or update `docs/features/<feature>/index.md`.

The feature-local index is an execution guide only. Card frontmatter remains the canonical source for dependency metadata.

For single-card features, the feature-local index is optional.

## Readiness Review

Before presenting a card as ready, verify it has:

- required frontmatter
- objective
- expected behavior
- acceptance criteria
- expected files or source areas
- validation commands
- out-of-scope items
- explicit scope for public APIs, schemas, persistence, permissions, security, or external behavior when relevant

If any item is unknown, mark the card as not ready and state the missing evidence.

## Report Format

State:

- planning scope
- evidence converted
- cards created or updated
- dependency graph summary
- feature-local index updated, if applicable
- cards not ready, if any
- out-of-scope items
