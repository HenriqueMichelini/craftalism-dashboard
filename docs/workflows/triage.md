# Workflow: Triage

## Purpose

Use this workflow to classify a defect, failing test, log, regression, or unexpected behavior without changing files.

Triage identifies the smallest likely feature, failure boundary, and next evidence step before card planning or implementation.

## Required Steps

1. Read `AGENTS.md`.
2. Read `docs/index.md`.
3. Read `docs/context-policy.md`.
4. Read this workflow.
5. Inspect the failing test, log, reproduction case, or error message.
6. Identify the affected feature, if possible.
7. Read the affected feature contract only when the feature is identifiable.
8. Inspect only source files directly connected to the failure path.
9. Report the likely boundary and whether a card is needed.

## Rules

- Triage is read-only.
- Prefer concrete evidence over assumptions.
- Do not implement fixes.
- Do not update documentation.
- Do not redefine contracts.
- Do not assume ownership without evidence.
- If the likely fix affects public API usage, schemas, persistence, permissions, security, or external behavior, report that explicit card scope is required.

## Report Format

State:

- symptom summary
- evidence reviewed
- probable failure boundary
- smallest likely feature
- ranked hypotheses
- missing evidence
- recommended next step
- card needed, if applicable
