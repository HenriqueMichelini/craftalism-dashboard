# Architecture Boundaries

## Purpose

This file defines what each part of `craftalism-dashboard` is allowed to know, call, or modify.

Use this document when a task affects module boundaries, dependencies, public API usage, runtime configuration, security posture, or cross-feature behavior.

## Repository Boundary

`craftalism-dashboard` is a frontend consumer repository.

It owns:

- browser UI and dashboard layout behavior
- frontend API clients and route path construction
- loading, empty, error, and retry presentation
- frontend runtime configuration consumption
- dashboard-local tests and documentation

It must not own:

- API route definitions or aliases
- backend transfer, balance, player, or transaction semantics
- auth token issuance, issuer metadata, or JWKS behavior
- deployment orchestration outside dashboard container behavior
- ecosystem-wide shared standards

## Layers

| Layer | Owns | Must Not Own |
|---|---|---|
| Layout/UI | Dashboard shell, navigation presentation, reusable components | Backend data semantics |
| Feature views | Players, balances, and transactions view composition | API contract definition |
| API client | Frontend request construction and response consumption | Server route ownership or compatibility aliases |
| Runtime config | Browser-visible API base URL and timeout consumption | Secret storage or auth issuer configuration |
| Tests | Frontend route-client, hook, component, and view confidence | Backend integration guarantees owned by service repos |

## Dependency Direction

Frontend source should depend inward toward shared primitives:

```text
Dashboard views
  ↓
Shared components and hooks
  ↓
API client and runtime config
  ↓
Craftalism API over HTTP
```

Shared components must not import feature views.

API modules must not import React components.

## Public Contracts

The dashboard consumes public and protected behavior from other Craftalism repositories. It does not define those contracts.

Relevant consumed contracts and standards:

- `transaction-routes`
- `error-semantics`
- `auth-issuer`, only if dashboard auth is introduced
- `ci-cd`
- `testing`
- `documentation`
- `security-access-control`

## Persistence Boundaries

The dashboard has no owned database, migration, or durable persistence boundary.

Browser storage or caching must not be introduced for sensitive data without explicit scope and security review.

## Security Boundaries

- The standalone dashboard container has no built-in authentication.
- Dashboard access control must be provided by deployment or edge infrastructure unless a future explicitly scoped dashboard auth feature is implemented.
- Browser-visible runtime config must not contain secrets.
- API read posture and dashboard access posture are separate and must be documented separately.

## Cross-Feature Rules

- API path changes must be centralized under `react/src/api/` and tested.
- Shared table or hook changes must preserve all dashboard views unless the selected scope says otherwise.
- UI placeholders must not be documented as implemented write flows.
