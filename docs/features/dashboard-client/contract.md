# Dashboard Client Contract

## Purpose

The dashboard client presents read-oriented Craftalism economy data in a browser UI.

This repository owns frontend consumption and presentation. It does not own backend API semantics.

## Goals

- Display players, balances, and transactions from the Craftalism API.
- Keep API route usage aligned with canonical Craftalism contracts.
- Provide coherent loading, empty, error, and retry behavior for dashboard data views.
- Keep runtime configuration understandable and safe for browser exposure.
- Maintain useful frontend validation through lint, tests, and build checks.

## Non-Goals

- Define or alias backend API routes.
- Implement backend economy, transaction, balance, or player behavior.
- Implement dashboard authentication without explicit scope.
- Store sensitive data in browser-visible configuration.
- Add write flows for UI placeholders unless a selected card explicitly requires them.

## Domain Rules

- API path construction belongs under `react/src/api/`.
- Dashboard views must use typed API methods instead of duplicating fetch logic.
- Loading, empty, error, and retry states must remain visible and actionable.
- Runtime config consumed by the browser must be non-secret.
- Documentation must not imply authentication or write behavior that is not implemented.

## Invariants

- The dashboard remains a consumer of API-owned contracts.
- Public route and access-control assumptions must match Craftalism shared contracts and standards.
- Existing read views must not regress when shared table, hook, API client, or runtime config code changes.
- Release workflows must not publish artifacts unless dashboard quality gates pass for the relevant commit.

## Inputs

| Input | Description |
|---|---|
| Craftalism API responses | Player, balance, and transaction data returned by API read endpoints |
| Runtime config | Browser-visible API base URL and timeout values |
| User interaction | View selection and retry actions |

## Outputs

| Output | Description |
|---|---|
| Dashboard UI | Table-based players, balances, and transactions views |
| Request behavior | Fetch calls to configured Craftalism API paths |
| UI state | Loading, empty, error, and data states |

## External Interfaces

- `GET /api/players`
- `GET /api/players/{uuid}`
- `GET /api/balances`
- `GET /api/balances/{uuid}`
- `GET /api/transactions`
- `GET /api/transactions/{id}`
- `GET /api/transactions/to/{uuid}`
- `GET /api/transactions/from/{uuid}`
- Docker/Nginx runtime config through `react/docker-entrypoint.sh`
- GitHub Actions quality and image build workflows

## Cross-Feature Dependencies

- `transaction-routes` shared contract from the Craftalism governance repo
- `error-semantics` shared contract from the Craftalism governance repo
- `auth-issuer` shared contract only if dashboard auth is introduced
- `ci-cd`, `testing`, `documentation`, and `security-access-control` shared standards

## Public Contract Change Rules

Changes to consumed API paths, route assumptions, permissions, security posture, or external behavior require explicit scope and the relevant Craftalism shared contract or standard must be checked first.

## Persistence Rules

The dashboard owns no durable persistence.

Do not add browser persistence for sensitive data without explicit security scope.

## Error and Failure Rules

- Data-fetch failures must surface an error state.
- Retry behavior must remain available where data views support it.
- Client-side handling must not hide backend failures in a way that misrepresents system state.

## Security and Permission Rules

- The standalone dashboard container has no built-in authentication.
- Dashboard access protection is separate from API route protection.
- Browser-visible runtime config must not contain secrets.
- Any future dashboard auth behavior must align with Craftalism auth and security standards.

## Validation Rules

Use the default frontend validation for behavior changes:

```bash
cd react
npm run lint
npm run test
npm run build
```

Route-client changes should include tests under `react/tests/api/`.

Hook or table-state changes should include tests under `react/tests/hooks/` or `react/tests/components/`.

View behavior changes should include tests under `react/tests/pages/` when practical.

## Source Areas

```text
react/src/api/
react/src/config/
react/src/hooks/
react/src/components/
react/src/pages/Dashboard/
react/Dockerfile
react/docker-entrypoint.sh
react/nginx.conf
.github/workflows/
```

## Test Areas

```text
react/tests/
```
