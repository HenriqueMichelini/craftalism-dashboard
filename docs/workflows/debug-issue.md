# Workflow: Debug Issue

## Purpose

Use this workflow to investigate defects, failing tests, regressions, or unexpected behavior.

If the task is read-only classification, use `triage.md` instead.

If the fix is not already bounded by a selected ready card or explicit fix scope, triage first and create or select a card before implementation.

## Required Steps

1. Read `AGENTS.md`.
2. Read `docs/index.md`.
3. Read `docs/context-policy.md`.
4. Read this workflow.
5. Identify the affected feature, if possible.
6. Read the affected feature contract.
7. Inspect the failing test, log, error message, or reproduction case.
8. Inspect only source files directly connected to the failure path.
9. Explain the likely cause before changing code.
10. Apply the smallest fix.
11. Run targeted validation first, then broader validation if required.

## Debugging Rules

- Prefer concrete evidence over assumptions.
- Do not rewrite working code broadly.
- Do not fix unrelated issues.
- If documentation and behavior conflict, report the conflict.

## Report Format

State:

- observed failure
- expected behavior
- likely cause
- files inspected
- fix applied
- validation result
- remaining risks
