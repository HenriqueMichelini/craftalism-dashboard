# Market Trades Contract

## Purpose

The dashboard displays read-only buy and sell market trade operations from the Craftalism API.

## Ownership

This repository owns:

- dashboard-local API client route usage for market trades
- dashboard table rendering for market trade rows
- loading, error, empty, and retry behavior for the market trades table
- dashboard-local tests for route usage and view behavior

This repository consumes:

- market trade API route semantics
- market trade response schema
- backend ordering and filtering semantics
- backend error semantics

## Consumed API Routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/market/trades` | List buy and sell market trades for the table display. |
| `GET` | `/api/market/trades/{id}` | Reserved for retrieving one market trade by ID. |

The initial dashboard table uses only `GET /api/market/trades`.

## Market Trade Row

The dashboard expects each listed market trade to match this shape:

```ts
type MarketTrade = {
  id: string;
  type: "buy" | "sell";
  playerUuid: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
};
```

## Expected Dashboard Behavior

- Market trades appear in a top-level dashboard tab labeled `Market Trades`.
- The first version is read-only.
- The table displays columns in this order: `Id`, `Type`, `Player`, `Item`, `Quantity`, `Unit Price`, `Total Price`, `Created At`.
- `unitPrice` and `totalPrice` use the dashboard currency formatter.
- `createdAt` uses the dashboard date formatter.
- IDs use the same monospaced table style as existing dashboard resource tables.
- `type` is rendered as a small visual label: `Buy` in green and `Sell` in gold.
- The table preserves backend result order.
- The empty state says `No market trades found.`
- The table reuses existing dashboard loading, error, empty, and retry states.

## Out of Scope

- Backend route implementation or aliases
- Backend market trade semantics
- Create, update, or delete flows
- Filtering
- Sorting
- Detail page behavior
- Inferring buy or sell operations from transactions

