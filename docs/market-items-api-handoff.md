# Market Items API Contract Handoff

## Purpose

The dashboard needs a new `Market Items` CRUD table. This handoff originally captured the missing API contract, and now records the API-side resolution needed for dashboard implementation.

## Confirmed Dashboard Planning

The dashboard planning artifacts were added under:

```text
craftalism-dashboard/docs/features/market-items/
```

They define two dependent cards:

```text
CARD-001-confirm-api-market-item-crud-contract.md
CARD-002-build-market-items-crud-table.md
```

`CARD-002` must not start until `CARD-001` is confirmed or equivalent API contract evidence is explicitly provided.

## Resolution Update

`craftalism-api` now implements and validates the dashboard admin market item CRUD contract through its `dashboard-crud-api` feature card `CARD-002-implement-dashboard-market-item-crud-api.md`.

Dashboard implementation can proceed with one important contract adjustment: `buyUnitEstimate`, `sellUnitEstimate`, `currentStock`, `variationPercent`, and `marketMomentum` are API-recomputed response projections and must not be sent by the dashboard in create or update requests.

## Initial Unresolved Risk

Dashboard implementation remains blocked until `craftalism-api` confirms the routes, schemas, validation errors, and delete rejection behavior.

## Expected API-Owned Routes

The dashboard expects `craftalism-api` to own and document these admin routes:

```text
GET    /api/dashboard/market/items
POST   /api/dashboard/market/items
PATCH  /api/dashboard/market/items/{itemId}
DELETE /api/dashboard/market/items/{itemId}
```

Expected response shapes:

```text
GET    /api/dashboard/market/items          -> MarketItem[]
POST   /api/dashboard/market/items          -> MarketItem
PATCH  /api/dashboard/market/items/{itemId} -> MarketItem
DELETE /api/dashboard/market/items/{itemId} -> 204 No Content
```

## Expected Market Item Shape

The dashboard plans to consume a flat row shape equivalent to:

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

The dashboard can adapt local camelCase mapping if the API contract confirms a different JSON casing convention.

## Create Semantics To Confirm

Required from dashboard on create:

```text
itemId
categoryId
categoryDisplayName
displayName
iconKey
currency
blocked
operating
```

Defaulted by API/DB when omitted, but shown prefilled in the dashboard create form:

```text
baseUnitPrice = 1
minUnitPrice = 1
maxUnitPrice = 1
segmentSize = 50
priceSensitivity = 0.0800
baseRegenQuantity = 1
regenIntervalSeconds = 60
netPosition = 0
minNetPosition = null
maxNetPosition = null
```

API-owned:

```text
lastUpdatedAt
```

## Edit Semantics To Confirm

Immutable after creation:

```text
itemId
categoryId
displayName
```

Editable:

```text
categoryDisplayName
iconKey
currency
blocked
operating
marketMomentum
baseUnitPrice
minUnitPrice
maxUnitPrice
segmentSize
priceSensitivity
baseRegenQuantity
regenIntervalSeconds
netPosition
minNetPosition
maxNetPosition
```

The dashboard must not send `lastUpdatedAt`; the API should set it.

The dashboard must also not send `buyUnitEstimate`, `sellUnitEstimate`, `currentStock`, `variationPercent`, or `marketMomentum`; the API recomputes those derived pressure-ladder projections.

## Validation Semantics To Confirm

The dashboard will block obvious invalid input as UX only. The API must remain authoritative for all constraints.

Expected constraint coverage:

```text
baseUnitPrice > 0
minUnitPrice > 0
minUnitPrice <= baseUnitPrice
maxUnitPrice >= baseUnitPrice
segmentSize > 0
priceSensitivity > 0
baseRegenQuantity >= 0
regenIntervalSeconds > 0
minNetPosition <= 0 when present
maxNetPosition >= 0 when present
minNetPosition <= maxNetPosition when both present
```

The API contract should define structured validation error behavior for invalid requests.

## Delete Semantics To Confirm

The dashboard will call:

```text
DELETE /api/dashboard/market/items/{itemId}
```

Expected dashboard behavior:

- show a confirmation before submitting
- wait for API success before removing the row locally
- remove the row on success
- keep the row and show the API error on rejection

The API must define whether hard delete is allowed only when referentially safe and how rejection is represented.

If the intended operation is disable-from-market rather than hard delete, the API contract should say so explicitly and dashboard implementation should use `PATCH blocked=true` or `PATCH operating=false` instead of `DELETE`.

## Requested Investigation In `craftalism-api`

Investigate the API repository and report:

1. Whether market item persistence/model/controller/service code already exists.
2. Whether dashboard admin route patterns already exist for similar resources.
3. Where the API contract for these routes should live.
4. Whether the expected fields and constraints match the existing database/entity model.
5. Whether hard delete is referentially safe or should reject with a structured error.
6. What implementation cards or API-side next steps are required before dashboard `CARD-002` can begin.

Do not implement the dashboard feature until this contract is confirmed.
