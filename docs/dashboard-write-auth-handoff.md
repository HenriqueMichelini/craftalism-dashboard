# Dashboard Write Auth Follow-Up Handoff

## Symptom

Creating a player from the dashboard sends:

```text
POST /api/players
```

The API responds:

```text
403
```

Observed request origin:

```text
http://localhost:8080/
```

## Confirmed Dashboard State

- The dashboard modal integration now calls the canonical API write route.
- `POST /api/players` is constructed by `react/src/api/endpoints/players.ts`.
- The dashboard does not currently implement authentication or token acquisition.
- The dashboard repository explicitly forbids storing secrets in browser-visible runtime configuration.

## Confirmed API Contract

`craftalism-api` owns player and balance write semantics.

The dashboard CRUD API contract says write endpoints require existing API write authority:

```text
POST /api/players
PATCH /api/players/{uuid}
DELETE /api/players/{uuid}
POST /api/balances
PATCH /api/balances/{uuid}
DELETE /api/balances/{uuid}
```

The API security config currently requires `SCOPE_api:write` for all write methods under `/api/**`.

## Relevant Evidence

- `craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/config/SecurityConfig.java`
  - `GET /api/**` is public.
  - `POST`, `PUT`, `PATCH`, and `DELETE /api/**` require `SCOPE_api:write`.
- `craftalism-api/java/src/test/java/io/github/HenriqueMichelini/craftalism/api/security/SecurityFilterChainTest.java`
  - read-only tokens cannot `POST /api/players`; expected status is `403`.
- `craftalism-dashboard/docs/architecture/boundaries.md`
  - standalone dashboard has no built-in authentication.
  - dashboard access control is deployment/edge-owned unless a future dashboard auth feature is explicitly scoped.
  - browser-visible runtime config must not contain secrets.

## Authorization Server Result

`craftalism-authorization-server` now provides an optional confidential OAuth client for a server-side dashboard write proxy:

```text
client_id: dashboard-bff
grant_type: client_credentials
scopes: api:read api:write
secret source: DASHBOARD_BFF_CLIENT_SECRET
```

The browser must not receive this secret. The supported path is a server-side BFF or edge component that obtains `api:write` tokens and proxies only approved dashboard write actions to `craftalism-api`.

## Important Follow-Up

The dashboard still cannot safely call protected API write routes directly from the browser. Implement a same-origin server-side write proxy for dashboard modal mutations.

## Overall Objective

Persist player and balance modal create, update, and delete actions from the dashboard through a secure server-side component that holds the confidential `dashboard-bff` credentials outside the browser.

## Target Architecture

```text
Browser dashboard
  -> same-origin dashboard BFF or edge write endpoint
  -> authorization server /oauth2/token using dashboard-bff client_credentials
  -> craftalism-api protected write route with Bearer token containing api:write
```

Read requests may continue using the existing public `GET /api/**` path unless a separate security card changes the read posture.

## Scope By Repository

### craftalism-dashboard

Ownership:

- Browser UI behavior.
- API client path construction for dashboard-owned frontend calls.
- Loading, submitting, success, failure, and retry presentation for modal writes.

Implement:

- Replace browser calls to protected API write routes with calls to same-origin BFF/edge write endpoints.
- Keep player and balance modal validation unchanged unless the BFF contract requires a request-shape adjustment.
- Keep mutation failures visible in the modal and do not update local table state until the BFF returns success.
- Add or update frontend tests that verify modal write clients call BFF/edge paths, not protected `craftalism-api` write paths directly.

Likely files:

```text
react/src/api/endpoints/players.ts
react/src/api/endpoints/balances.ts
react/src/pages/Dashboard/views/PlayersView/
react/src/pages/Dashboard/views/BalancesView/
react/tests/api/players.test.ts
react/tests/api/balances.test.ts
```

Out of scope:

- Storing OAuth client secrets in frontend config.
- Browser token acquisition for `api:write`.
- Changing API route ownership or backend mutation semantics.
- Making dashboard writes unauthenticated.

### craftalism-deployment Or BFF/Edge Component

Ownership:

- Runtime wiring for same-origin dashboard write endpoints.
- Secret storage for `DASHBOARD_BFF_CLIENT_SECRET`.
- Token acquisition and forwarding to `craftalism-api`.
- Local and deployed routing between dashboard, authorization server, and API.

Implement:

- Provide same-origin endpoints for the exact dashboard write operations:

```text
POST /api/dashboard/players
PATCH /api/dashboard/players/{uuid}
DELETE /api/dashboard/players/{uuid}
POST /api/dashboard/balances
PATCH /api/dashboard/balances/{uuid}
DELETE /api/dashboard/balances/{uuid}
POST /api/dashboard/market/categories
PATCH /api/dashboard/market/categories/{categoryId}
DELETE /api/dashboard/market/categories/{categoryId}
```

- Obtain a token from the authorization server using:

```text
grant_type=client_credentials
client_id=dashboard-bff
client_secret=${DASHBOARD_BFF_CLIENT_SECRET}
scope=api:write
```

- Forward approved requests to canonical `craftalism-api` routes:

```text
POST /api/players
PATCH /api/players/{uuid}
DELETE /api/players/{uuid}
POST /api/balances
PATCH /api/balances/{uuid}
DELETE /api/balances/{uuid}
POST /api/dashboard/market/categories
PATCH /api/dashboard/market/categories/{categoryId}
DELETE /api/dashboard/market/categories/{categoryId}
```

- Preserve API status codes and response bodies where practical so the dashboard can surface failures coherently.
- Keep CORS and origin behavior aligned for local dev and deployment.

Likely files:

```text
craftalism-deployment compose or proxy config
BFF service source, if one exists or is added
deployment/runtime environment templates
```

Out of scope:

- Issuing dashboard write tokens to browser JavaScript.
- Broad auth redesign.
- Changing API controller validation or persistence behavior.

### craftalism-authorization-server

Ownership:

- OAuth client registration.
- Token issuance for the confidential `dashboard-bff` client.

Already implemented:

- Optional `dashboard-bff` confidential client.
- `client_credentials` issuance with `api:read api:write`.
- Environment-backed `DASHBOARD_BFF_CLIENT_ID` and `DASHBOARD_BFF_CLIENT_SECRET`.

Follow-up scope:

- No further change expected unless deployment needs a different client id, secret source, scope set, or token claim.
- If token audience enforcement is introduced later, define it in an explicit auth/API contract card first.

Out of scope:

- Browser authorization-code flow for this follow-up.
- Public clients with write scope.

### craftalism-api

Ownership:

- Protected player and balance write route semantics.
- JWT validation and `SCOPE_api:write` enforcement.
- API error response semantics.

Expected behavior:

- Keep `GET /api/**` public under the current contract.
- Keep `POST`, `PUT`, `PATCH`, and `DELETE /api/**` protected by `SCOPE_api:write`.
- Accept BFF-forwarded Bearer JWTs from `craftalism-authorization-server`.

Likely files:

```text
java/src/main/java/io/github/HenriqueMichelini/craftalism/api/config/SecurityConfig.java
java/src/test/java/io/github/HenriqueMichelini/craftalism/api/security/
```

Expected changes:

- None for the minimal follow-up, unless verification shows issuer, scope, or CORS/proxy behavior is misconfigured.

Out of scope:

- Making write routes public.
- Adding dashboard-specific aliases in the API.
- Changing player or balance persistence semantics.

## Required Cards Or Work Items

Create separate work items instead of mixing repos in one change:

1. `craftalism-deployment` or BFF card: add same-origin dashboard write proxy using the confidential `dashboard-bff` OAuth client.
2. `craftalism-dashboard` card: route player and balance modal write clients through the BFF endpoints.
3. Optional `craftalism-api` verification card: smoke-test BFF-issued tokens against protected player and balance write routes.
4. Optional docs card: document the local dev write path after the proxy route names and runtime variables are finalized.

## Local Dev Verification Path

1. Start `craftalism-authorization-server` with:

```text
DASHBOARD_BFF_CLIENT_ID=dashboard-bff
DASHBOARD_BFF_CLIENT_SECRET=<local server-side secret>
```

2. Start `craftalism-api` with issuer/JWKS configuration pointed at the authorization server.
3. Start the dashboard BFF/edge proxy with the same `DASHBOARD_BFF_CLIENT_SECRET`.
4. Start the dashboard at the local origin, such as:

```text
http://localhost:8080/
```

or the Vite dev origin if used.

5. Create a player from the dashboard modal.
6. Verify:

```text
Browser -> BFF endpoint: 2xx
BFF -> /oauth2/token: 2xx
BFF -> craftalism-api POST /api/players: 201
Dashboard table updates only after success
No OAuth client secret appears in browser JavaScript, network payloads, or runtime config
```

7. Repeat for:

```text
PATCH /players/{uuid}
DELETE /players/{uuid}
POST /balances
PATCH /balances/{uuid}
DELETE /balances/{uuid}
```

## Acceptance Criteria

- Dashboard modal writes no longer send unauthenticated browser requests directly to protected `craftalism-api` write routes.
- Server-side BFF/edge component obtains `api:write` tokens using `dashboard-bff`.
- `craftalism-api` still rejects direct unauthenticated browser writes with `403`.
- Player and balance create/update/delete succeed through the proxy in local dev.
- Client secrets remain server-side only.
- Frontend tests prove dashboard write clients target BFF paths.
- Deployment or runbook docs identify required environment variables and local verification steps.

## Non-Goals

- Browser OAuth login or user session design.
- Role-based dashboard user authorization.
- Public write endpoints.
- API route renaming.
- Token audience redesign.
- Changing public read behavior.
