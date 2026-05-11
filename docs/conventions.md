# Project Conventions

## Purpose

This file defines stable project-wide conventions for `craftalism-dashboard`.

Keep feature-specific rules in feature contracts and task-specific details in cards.

## Code Style

- Use TypeScript for frontend source and tests.
- Keep API path construction centralized under `react/src/api/`.
- Keep reusable UI primitives under `react/src/components/`.
- Keep dashboard view behavior under `react/src/pages/Dashboard/`.
- Prefer explicit names and simple control flow.
- Avoid unrelated refactors during feature work.

## Testing Conventions

- Unit tests should validate isolated client, hook, formatting, and component behavior.
- Contract-sensitive tests should verify dashboard route assumptions against canonical API paths.
- Behavior-changing work should include or update tests unless the selected scope explicitly exempts it.
- Tests live under `react/tests/`.

## Documentation Conventions

- `README.md` is the project overview and operator-facing setup guide.
- `docs/repo-contract-map.md` owns dashboard ownership and consumed-contract mapping.
- `docs/repo-requirement-pack.md` owns current phase requirements.
- Feature rules belong in `docs/features/<feature>/contract.md`.
- Task-specific details belong in cards.
- Historical or exploratory notes must not become authoritative by accident.

## Security and Access-Control Conventions

- The standalone dashboard container does not implement built-in authentication.
- Do not imply backend protection or dashboard access protection that is not implemented.
- Any dashboard authentication rollout requires explicit scope and alignment with the Craftalism `auth-issuer` and `security-access-control` standards.

## Commit or Change Conventions

- Keep one implementation focused on one card or explicit user scope.
- Do not mix feature work, formatting, and refactoring unless the selected task requires it.
- Do not change public API usage, route assumptions, or security posture without updating the relevant contract or documentation.

## Validation Conventions

Default validation for code changes:

```bash
cd react
npm run lint
npm run test
npm run build
```

Default validation for documentation-only changes:

```bash
rg -n "$SCAFFOLD_PATTERN" AGENTS.md AGENT-PROMPT.md README.md docs
```

Set `SCAFFOLD_PATTERN` to the template placeholders relevant to the change being checked.
