# Workflow: Update Documentation

## Purpose

Use this workflow when documentation must be created, corrected, or synchronized with implementation.

## Required Steps

1. Read `AGENTS.md`.
2. Read `docs/index.md`.
3. Read `docs/context-policy.md`.
4. Read this workflow.
5. Identify affected documentation files.
6. Inspect only the source or tests needed to verify the documentation.
7. Update the smallest necessary documentation set.
8. Avoid duplicating rules across multiple files.

## Documentation Placement Rules

Use:

- `README.md` for project overview
- `docs/index.md` for routing
- `docs/context-policy.md` for context rules
- `docs/repo-contract-map.md` for dashboard ownership and consumed contracts
- `docs/repo-requirement-pack.md` for current phase requirements
- `docs/conventions.md` for project-wide conventions
- `docs/architecture/` for architecture boundaries
- `docs/features/<feature>/contract.md` for stable feature rules
- `docs/features/<feature>/cards/` for task-specific implementation
- `docs/wiki/` for non-authoritative background notes, if such notes are introduced later

## Report Format

State:

- docs changed
- reason for change
- source evidence used
- conflicts resolved
- remaining ambiguity
