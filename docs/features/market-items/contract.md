# Market Items Contract

## Purpose

The dashboard displays and manages market item configuration through API-owned dashboard admin routes.

This feature lets operators view current market items, create items, update editable item configuration, and remove items when the API accepts deletion.

## Ownership

This repository owns:

- dashboard-local API client route usage for market item admin routes
- dashboard table rendering for market item rows
- create, edit, delete, loading, error, empty, retry, and validation UX
- dashboard-local tests for route usage and view behavior

This repository consumes:

- market item API route semantics
- market item response and mutation request schemas
- backend persistence, pricing, stock, regeneration, and position semantics
- backend validation and deletion rejection behavior
- backend timestamp management

## API Contract Prerequisite

Market item CRUD routes are owned by `craftalism-api` and must be confirmed before dashboard implementation.

Expected consumed routes:

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/dashboard/market/items` | List market item admin rows. |
| `POST` | `/api/dashboard/market/items` | Create a market item. |
| `PATCH` | `/api/dashboard/market/items/{itemId}` | Update editable fields for a market item. |
| `DELETE` | `/api/dashboard/market/items/{itemId}` | Remove a market item when the API accepts deletion. |

Expected response shapes:

- `GET /api/dashboard/market/items` returns `MarketItem[]`.
- `POST /api/dashboard/market/items` returns `MarketItem`.
- `PATCH /api/dashboard/market/items/{itemId}` returns `MarketItem`.
- `DELETE /api/dashboard/market/items/{itemId}` returns `204 No Content`.

## Market Item Row

The dashboard expects each listed market item to match this shape after the API contract is confirmed:

```ts
type MarketItem = {
  itemId: string;
  categoryId: string;
  categoryDisplayName: string;
  displayName: string;
  iconKey: string;
  buyUnitEstimate: number;
  sellUnitEstimate: number;
  currency: string;
  currentStock: number;
  variationPercent: number;
  blocked: boolean;
  operating: boolean;
  lastUpdatedAt: string;
  marketMomentum: number;
  baseUnitPrice: number;
  minUnitPrice: number;
  maxUnitPrice: number;
  segmentSize: number;
  priceSensitivity: number;
  baseRegenQuantity: number;
  regenIntervalSeconds: number;
  netPosition: number;
  minNetPosition: number | null;
  maxNetPosition: number | null;
};
```

The dashboard uses camelCase model fields locally. API field casing must be confirmed by the owning API contract before implementation.

## Create Behavior

Create mode must let operators provide:

- `itemId`
- `categoryId`
- `categoryDisplayName`
- `displayName`
- `iconKey`
- `buyUnitEstimate`
- `sellUnitEstimate`
- `currency`
- `currentStock`
- `variationPercent`
- `blocked`
- `operating`

Create mode must also show these defaulted controls in the form:

- `marketMomentum`: `0`
- `baseUnitPrice`: `1`
- `minUnitPrice`: `1`
- `maxUnitPrice`: `1`
- `segmentSize`: `50`
- `priceSensitivity`: `0.0800`
- `baseRegenQuantity`: `1`
- `regenIntervalSeconds`: `60`
- `netPosition`: `0`
- `minNetPosition`: empty/null
- `maxNetPosition`: empty/null

`lastUpdatedAt` is API-owned and must not be sent by the dashboard.

## Edit Behavior

Edit mode must make these fields read-only:

- `itemId`
- `categoryId`
- `displayName`

Edit mode may update:

- `categoryDisplayName`
- `iconKey`
- `buyUnitEstimate`
- `sellUnitEstimate`
- `currency`
- `currentStock`
- `variationPercent`
- `blocked`
- `operating`
- `marketMomentum`
- `baseUnitPrice`
- `minUnitPrice`
- `maxUnitPrice`
- `segmentSize`
- `priceSensitivity`
- `baseRegenQuantity`
- `regenIntervalSeconds`
- `netPosition`
- `minNetPosition`
- `maxNetPosition`

`lastUpdatedAt` remains API-owned and must not be sent by the dashboard.

## Delete Behavior

The delete action is labeled as remove behavior in the dashboard and calls `DELETE /api/dashboard/market/items/{itemId}`.

- The dashboard shows a confirmation before submitting.
- The dashboard waits for API success before removing the row locally.
- On success, the dashboard removes the row from the table.
- On rejection, the dashboard keeps the row and shows the API error message.
- The dashboard must not introduce local archive, soft-delete, blocked, or operating semantics unless the API contract defines them.

## Validation UX

The dashboard blocks obvious invalid input before submit as UX validation only. The API remains authoritative.

Dashboard validation rules:

- `baseUnitPrice > 0`
- `minUnitPrice > 0`
- `minUnitPrice <= baseUnitPrice`
- `maxUnitPrice >= baseUnitPrice`
- `segmentSize > 0`
- `priceSensitivity > 0`
- `baseRegenQuantity >= 0`
- `regenIntervalSeconds > 0`
- `minNetPosition <= 0` when present
- `maxNetPosition >= 0` when present
- `minNetPosition <= maxNetPosition` when both are present

## Expected Dashboard Behavior

- Market items appear in a top-level dashboard tab labeled `Market Items`.
- The table preserves backend result order.
- The table displays columns in this order: `Item`, `Category`, `Buy Estimate`, `Sell Estimate`, `Currency`, `Stock`, `Variation %`, `Blocked`, `Operating`, `Last Updated`.
- Row click opens an edit modal.
- Create uses the same modal with identity fields editable.
- Edit mode makes `itemId`, `categoryId`, and `displayName` read-only.
- The modal groups fields into `Identity`, `Pricing`, `Stock & Position`, `Regeneration`, and `State`.
- The empty state says `No market items found.`
- API-backed filtering is deferred.

## Out of Scope

- Backend route implementation
- Backend market item persistence or pricing semantics
- Defining shared API contracts locally as authoritative
- API-backed filtering
- Sorting
- Detail pages
- Local soft-delete or archive behavior
- Browser persistence
