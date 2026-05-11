---
id: CARD-002
feature: dashboard-client
status: planned
depends_on:
  - CARD-001
parallel_safe: false
---

# CARD-002: Add Read-Only Market Snapshot Table

## Status

planned

## Objective

Add a read-only market dashboard tab that fetches `GET /api/market/snapshot` through a typed API endpoint and renders one table row per market item.

## Context

The API-owned market snapshot response contains an opaque `snapshotVersion`, `generatedAt`, and grouped `categories`. Each category contains `categoryId`, `displayName`, and `items`. Each item contains API DTO fields such as `itemId`, `displayName`, `iconKey`, `buyUnitEstimate`, `sellUnitEstimate`, `currency`, market pressure fields, `variationPercent`, `blocked`, `operating`, and `lastUpdatedAt`.

The dashboard should flatten categories into table rows for display only. It must not compute authoritative prices locally, infer meaning from `snapshotVersion`, or introduce write market flows.

## Required Reading

- `../contract.md`
- `CARD-001.md`
- `../../../../../craftalism/docs/contracts/market-contract.md`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketSnapshotResponseDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketSnapshotCategoryDTO.java`
- `../../../../../craftalism-api/java/src/main/java/io/github/HenriqueMichelini/craftalism/api/dto/MarketSnapshotItemDTO.java`

## Expected Behavior

The dashboard exposes a Market tab alongside the existing dashboard views. Opening the Market tab loads the market snapshot through a typed API method for `GET /api/market/snapshot`, flattens snapshot categories into item rows, and renders a table with category, item id/name, buy estimate, sell estimate, currency, availability/status fields, generated/update timestamps where useful, and `snapshotVersion` as read-only context. Loading, empty, error, and retry states follow the existing table behavior.

## Acceptance Criteria

- [ ] A typed market snapshot model is added using the backend DTO field names for `snapshotVersion`, `generatedAt`, `categories`, category fields, and item fields.
- [ ] `react/src/api/` exposes a typed `marketsApi` or equivalent endpoint method that calls exactly `/api/market/snapshot`.
- [ ] The dashboard includes a Market tab/view wired through existing dashboard view patterns.
- [ ] The Market table renders one row per item by flattening `categories[].items[]`.
- [ ] The Market table includes category display context, item id/name, buy and sell estimates, currency, availability/status indicators from `blocked` and `operating`, and `snapshotVersion` as read-only context.
- [ ] Loading, empty, error, and retry states use the existing shared table state behavior.
- [ ] Tests cover the market API path, snapshot flattening/table config behavior, and Market view rendering.
- [ ] No quote, execute, buy, sell, auth, backend pricing, or cached degraded browsing behavior is added.

## Expected Files to Change

```text
react/src/api/index.ts
react/src/api/endpoints/market.ts
react/src/types/models/market.types.ts
react/src/pages/Dashboard/DashboardPage.tsx
react/src/pages/Dashboard/dashboard.config.ts
react/src/pages/Dashboard/views/index.ts
react/src/pages/Dashboard/views/MarketView/
react/tests/api/
react/tests/pages/
```

## Constraints

- Do not change backend repositories or shared market contract files.
- Do not alias, rename, or invent market API routes.
- Do not compute authoritative prices or parse `snapshotVersion`.
- Do not add write flows, authentication assumptions, quote creation, trade execution, or local cache fallback behavior.
- Preserve existing players, balances, and transactions dashboard behavior.

## Validation Commands

```bash
cd react
npm run lint
npm run test
npm run build
```

If the full frontend command set cannot run in the environment, run the narrowest available fallback and record the limitation:

```bash
cd react
npm run test
```

## Out of Scope

- Backend market API changes.
- Quote and execute flows.
- Buy and sell UI actions.
- Dashboard authentication.
- Cached degraded browsing or offline snapshot persistence.
- Filtering, sorting, search, pagination, or item detail pages.

## Completion Notes
