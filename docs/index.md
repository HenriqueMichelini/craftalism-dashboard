# Documentation Index

## Purpose

This file routes humans and AI agents to the smallest relevant context for `craftalism-dashboard`.

Do not read the entire documentation tree by default.

## Core Documents

| Need | Read |
|---|---|
| Agent operating rules | `../AGENTS.md` |
| Context selection rules | `context-policy.md` |
| Workflow selection | `workflows/index.md` |
| Dashboard contract ownership map | `repo-contract-map.md` |
| Dashboard requirement pack | `repo-requirement-pack.md` |
| Project-wide conventions | `conventions.md` |
| Architecture boundaries | `architecture/boundaries.md` |
| Feature list | `features/index.md` |
| Project overview and operations | `../README.md` |

## Craftalism Governance Context

For repo-specific work, use the Craftalism governance repository only through the routed files required by the task:

| Need | Read |
|---|---|
| Authority and conflict resolution | `../../craftalism/docs/governance-precedence.md` |
| Ecosystem role and ownership | `../../craftalism/docs/system-summary.md` |
| Shared standard routing | `../../craftalism/docs/wiki/standards-map.md` |
| Shared contract routing | `../../craftalism/docs/wiki/contracts-map.md` |

Do not scan the full governance `docs/` tree.

## Task Routing

| Task Type | Required Context |
|---|---|
| Select a workflow | `workflows/index.md` |
| Implement a feature card | `workflows/implement-card.md` + selected feature `contract.md` + selected card |
| Reverify completed work | `workflows/reverify-card.md` + selected card + changed files/tests |
| Plan implementation cards | `workflows/plan-cards.md` + confirmed evidence or approved plan + related feature contract, if any |
| Coordinate multiple cards, modules, or repositories | `workflows/batch-orchestrator.md` + selected work units + relevant feature-local indexes, if present |
| Triage a concrete failure without fixing it | `workflows/triage.md` + failing test/log/reproduction + likely feature contract, if identifiable |
| Debug and fix a concrete failure | `workflows/debug-issue.md` + selected ready card or explicit fix scope + related feature contract + failing test/log/source files |
| Audit a bounded area | `workflows/audit.md` + selected area docs/source/tests/config |
| Update documentation | `workflows/update-docs.md` + affected docs only |
| Refactor code | `workflows/refactor.md` + `conventions.md` + affected source/test files |
| Change public API usage, permissions, security, or external behavior | `architecture/boundaries.md` + affected feature contract + relevant Craftalism shared contract or standard + explicit scope |
| Audit a Gradle build | Use the `gradle-audit` skill only when this repository uses Gradle |
| Prepare a commit message | Use the `commit-standard` skill |
| Understand project background | `../README.md` first, then routed docs only |

## Ambiguous Cases

| Situation | Required Action |
|---|---|
| No selected card exists for card-based implementation | Ask for the selected card or use `workflows/plan-cards.md` if the user asked to plan |
| Feature cannot be identified | Stop or use defect evidence to identify the smallest likely feature |
| Failure has no confirmed fix scope | Use `workflows/triage.md` before implementation |
| Work spans multiple cards | Use `workflows/batch-orchestrator.md` or serialize manually |
| Validation is missing | Stop before implementation unless the selected workflow defines a fallback |
| Expected files are unknown | Inspect only enough source structure to identify likely files, then declare scope |
| Task touches another repository | Stop at the dashboard boundary and identify the owning repo |

## Context Escalation

Read additional context only when:

- the selected workflow requires it
- the selected card requires it
- source code contradicts documentation
- tests reveal hidden behavior
- validation fails
- the task affects architecture, security, public API usage, permissions, or cross-repo behavior

## Stop Rule

Stop reading once you have enough context to:

- describe the intended change
- identify affected files
- preserve relevant constraints
- implement safely
- validate the result
