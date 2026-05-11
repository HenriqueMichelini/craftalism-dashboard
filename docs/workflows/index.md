# Workflow Index

## Purpose

Use this file to map user intent to the smallest correct repo-local workflow and matching global skill.

This file is a router only. Workflow rules belong in the selected workflow file.

## Intent Routing

| Intent | Workflow | Skill |
|---|---|---|
| Implement one ready card | `implement-card.md` | `implement` |
| Reverify one completed card | `reverify-card.md` | `reverify` |
| Plan implementation cards | `plan-cards.md` | `plan-cards` |
| Coordinate multiple cards, modules, or repositories | `batch-orchestrator.md` | `batch-worker-orchestrator` |
| Triage a concrete failure without fixing it | `triage.md` | `triage` |
| Debug and fix a concrete failure | `debug-issue.md` | `triage`, then `plan-cards` or `implement` as needed |
| Audit a bounded area | `audit.md` | `audit` |
| Update documentation only | `update-docs.md` | `update-docs` |
| Refactor without behavior change | `refactor.md` | `refactor` |
| Audit a Gradle build | no generic workflow file | `gradle-audit` when this repository uses Gradle |
| Prepare a commit message | no repo workflow file | `commit-standard` |

## Ambiguous Cases

| Situation | Action |
|---|---|
| No selected ready card exists for implementation | Use `plan-cards.md` or ask for the selected card |
| Failure has symptoms but no bounded fix scope | Use `triage.md` |
| Work spans multiple cards or repositories | Use `batch-orchestrator.md` |
| Work changes public API usage, permissions, security, or external behavior | Require explicit card or task scope before implementation |
| Intent does not match any workflow | Stop and ask for the intended workflow |
