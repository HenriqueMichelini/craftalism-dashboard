# Dashboard Write 403 Explanation

## Summary

The dashboard received `403 Forbidden` when creating a player because the browser was sending an unauthenticated write request directly to a protected API route:

```text
POST /api/players
```

That route is intentionally protected by `craftalism-api`. API reads are public under the current contract, but API writes require a Bearer token with `api:write` authority. The standalone dashboard does not implement browser authentication, does not acquire write tokens, and must not store OAuth client secrets in browser-visible runtime configuration.

The correct long-term fix was not to make API writes public and not to put credentials in the browser. The fix was to add a deployment-owned server-side BFF that holds confidential credentials, obtains an `api:write` token, and forwards only approved dashboard write actions to the canonical API routes.

## What Was Happening

Before the fix, the dashboard player modal used the frontend players API client to send:

```text
Browser dashboard
  -> POST /api/players
  -> craftalism-api
```

The observed browser origin was:

```text
http://localhost:8080/
```

From the API point of view, this request had no valid `Authorization: Bearer ...` token with `api:write`. The API therefore rejected it with:

```text
403 Forbidden
```

This was expected API behavior, not an API persistence failure and not a player payload validation failure.

## Why The API Returned 403

`craftalism-api` owns player and balance write semantics and API authorization enforcement. Its current security contract is:

```text
GET /api/**                         public under the current read posture
POST /api/**                        requires SCOPE_api:write
PUT /api/**                         requires SCOPE_api:write
PATCH /api/**                       requires SCOPE_api:write
DELETE /api/**                      requires SCOPE_api:write
```

The relevant dashboard write routes are:

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

Those are protected API routes. A browser request from the dashboard without a write-authorized Bearer token is not allowed to perform those mutations.

The API test evidence also matched this behavior: read-only tokens cannot `POST /api/players`; the expected status is `403`.

## Why The Dashboard Could Not Fix This Alone

`craftalism-dashboard` owns:

- browser UI behavior
- frontend API client path construction
- loading, error, submitting, success, and retry presentation
- dashboard-local tests and documentation

It does not own:

- API route authorization rules
- OAuth token issuance
- JWT validation
- server-side secret storage
- deployment routing outside the dashboard container

The dashboard also explicitly must not put secrets in browser-visible runtime configuration. That ruled out storing `DASHBOARD_BFF_CLIENT_SECRET`, an `api:write` token, or any equivalent write credential in frontend JavaScript or Vite runtime config.

So the dashboard could not safely solve the `403` by acquiring a confidential-client token in the browser. That would move a server secret into an untrusted environment.

## Options Considered

### Make API Writes Public

Rejected.

This would violate the API security contract and allow unauthenticated mutation of player and balance data.

### Add Browser OAuth Write Tokens

Rejected for this handoff.

A browser authorization-code flow or dashboard user-session design is a larger authentication feature. It would require explicit product/security scope, user identity decisions, role/permission behavior, token storage decisions, and shared auth/API contract work.

### Store A Client Secret In Dashboard Runtime Config

Rejected.

The dashboard runtime config is browser-visible. Any secret placed there is effectively public.

### Add Dashboard-Specific Write Aliases In The API

Rejected.

The API owns canonical write route semantics. Adding dashboard-specific API aliases would mix dashboard deployment concerns into the API service and weaken the contract boundary.

### Add A Same-Origin Server-Side BFF

Accepted.

The BFF is server-side, deployment-owned, and can safely hold the confidential `dashboard-bff` credentials. The browser calls same-origin dashboard write endpoints, and the BFF obtains an `api:write` token before forwarding approved mutations to `craftalism-api`.

## Final Architecture

The target write path is:

```text
Browser dashboard
  -> same-origin /api/dashboard/... endpoint
  -> dashboard-bff
  -> authorization server /oauth2/token
  -> craftalism-api canonical /api/... write route
```

The BFF uses:

```text
grant_type=client_credentials
client_id=dashboard-bff
client_secret=${DASHBOARD_BFF_CLIENT_SECRET}
scope=api:write
```

The browser never receives `DASHBOARD_BFF_CLIENT_SECRET` and never receives the BFF's OAuth token.

## Implemented Repository Responsibilities

### `craftalism-deployment`

Deployment owns the BFF and runtime wiring.

Implemented behavior:

- Added a `dashboard-bff` sidecar service.
- Wired the dashboard container's existing `/api` proxy to `dashboard-bff`.
- Wired `DASHBOARD_BFF_CLIENT_ID` and `DASHBOARD_BFF_CLIENT_SECRET` into the authorization server service so the confidential client is registered.
- Added local env examples and README verification notes.
- Kept the secret server-side.

The BFF approves only these dashboard write routes:

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

It forwards them to canonical API routes:

```text
POST /api/players
PATCH /api/players/{uuid}
DELETE /api/players/{uuid}
POST /api/balances
PATCH /api/balances/{uuid}
DELETE /api/balances/{uuid}
```

Non-approved write methods under `/api/` are rejected by the BFF instead of being forwarded unauthenticated.

### `craftalism-dashboard`

Dashboard owns frontend route construction.

Implemented behavior:

- Player and balance reads still call public canonical API read routes:

```text
GET /api/players
GET /api/players/{uuid}
GET /api/balances
GET /api/balances/{uuid}
```

- Player and balance writes now call same-origin BFF routes:

```text
POST /api/dashboard/players
PATCH /api/dashboard/players/{uuid}
DELETE /api/dashboard/players/{uuid}
POST /api/dashboard/balances
PATCH /api/dashboard/balances/{uuid}
DELETE /api/dashboard/balances/{uuid}
```

- Frontend tests verify write clients target `/api/dashboard/...` and not the protected canonical API write paths directly.

### `craftalism-authorization-server`

The authorization server owns OAuth client registration and token issuance.

No source change was required in this pass because the handoff had already established support for the optional confidential `dashboard-bff` client. Deployment now supplies the required environment values.

### `craftalism-api`

The API owns write route protection and mutation semantics.

No source change was required. The API should continue to reject direct unauthenticated browser writes with `403`.

## End-To-End Process

1. A dashboard modal attempted to create a player.
2. The frontend called `POST /api/players`.
3. The request reached `craftalism-api` without `api:write` authority.
4. The API security layer rejected the request with `403`.
5. The root cause was traced to a contract mismatch at the dashboard boundary: the dashboard was correctly using the canonical API write path, but it was doing so from a browser context that had no write authority.
6. The repository boundaries were checked:
   - API write authorization belongs to `craftalism-api`.
   - Token issuance belongs to `craftalism-authorization-server`.
   - Runtime secret handling and same-origin proxying belong to `craftalism-deployment`.
   - Frontend request construction belongs to `craftalism-dashboard`.
7. A direct browser-auth or browser-secret solution was rejected because it would violate security boundaries.
8. A server-side BFF was selected because it keeps the secret outside the browser and preserves the protected API contract.
9. Deployment added `dashboard-bff`, wired the dashboard proxy to it, and configured the confidential client credentials server-side.
10. Dashboard write clients were changed to call `/api/dashboard/...` BFF routes.
11. Tests were updated to prove dashboard writes no longer target protected API write routes directly.

## Validation Performed

Deployment validation:

```text
node --check dashboard-bff/server.js
node --test dashboard-bff/server.test.js
docker compose --env-file env.example -f docker-compose.yml -f docker-compose.local.yml config
```

Dashboard validation:

```text
npm test
```

Result:

```text
12/12 dashboard tests passed
```

## Remaining Live Verification

The remaining proof is a full local stack smoke test:

1. Start the local stack with `DASHBOARD_BFF_CLIENT_SECRET` set server-side.
2. Open the dashboard at `http://localhost:8080/`.
3. Create, update, and delete a player.
4. Create, update, and delete a balance.
5. Verify browser network requests go to `/api/dashboard/...`.
6. Verify `dashboard-bff` obtains a token from `/oauth2/token`.
7. Verify `craftalism-api` receives canonical `/api/...` writes with a Bearer token.
8. Verify direct unauthenticated browser writes to protected API write routes still fail.
9. Verify `DASHBOARD_BFF_CLIENT_SECRET` does not appear in browser JavaScript, runtime config, or network payloads.

## Key Takeaway

The `403` was the correct response to an unauthorized write. The bug was architectural wiring: the dashboard was attempting a protected write from a browser-only context. The long-term aligned solution is a deployment-owned BFF that converts approved same-origin dashboard write requests into authorized API writes while preserving the API security contract.
