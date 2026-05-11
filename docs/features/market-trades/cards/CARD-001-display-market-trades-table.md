---
id: CARD-001
feature: market-trades
status: planned
depends_on: []
parallel_safe: true
---

# CARD-001: Display Market Trades Table

## Status

planned

## Objective

Add a read-only dashboard table for buy and sell market trade operations.

## Context

The market trades table is a new dashboard resource view, separate from the existing transactions view. Market trade semantics and response shape are consumed from the API; this repository only owns the frontend client and table display.

## Required Reading

- `../contract.md`
- `../../../conventions.md`

## Expected Behavior

The dashboard exposes a top-level `Market Trades` tab that fetches `GET /api/market/trades` and displays market trade rows in the existing dashboard table pattern with loading, error, empty, and retry states.

## Acceptance Criteria

- [ ] A `MarketTrade` model type exists with `id`, `type`, `playerUuid`, `itemId`, `quantity`, `unitPrice`, `totalPrice`, and `createdAt`.
- [ ] A market trades API client exposes `getAll()` using `GET /api/market/trades`.
- [ ] The dashboard includes a top-level tab labeled `Market Trades`.
- [ ] The market trades view renders a read-only table using the existing table component and `useTableData` pattern.
- [ ] The table columns are `Id`, `Type`, `Player`, `Item`, `Quantity`, `Unit Price`, `Total Price`, and `Created At`, in that order.
- [ ] `Buy` is rendered as a small green label and `Sell` is rendered as a small gold label.
- [ ] `unitPrice` and `totalPrice` use the existing currency formatter, and `createdAt` uses the existing date formatter.
- [ ] The empty state says `No market trades found.`
- [ ] Tests cover the dashboard tab/view wiring and the market trades route assumption.

## Expected Files to Change

```text
react/src/types/models/marketTrade.types.ts
react/src/api/endpoints/marketTrades.ts
react/src/api/index.ts
react/src/pages/Dashboard/DashboardPage.tsx
react/src/pages/Dashboard/views/index.ts
react/src/pages/Dashboard/views/MarketTradesView/
react/tests/api/
react/tests/pages/
```

## Constraints

- Do not change unrelated dashboard views.
- Do not modify transaction behavior or infer market trades from transactions.
- Do not introduce create, update, delete, filter, sort, or detail-page behavior.
- Do not redefine backend market trade semantics in frontend code.
- Keep API route usage centralized under `react/src/api/`.

## Validation Commands

```bash
cd react
npm run lint
npm run test
npm run build
```

If the full validation path is unavailable, run the largest available subset and record the skipped command and reason in completion notes.

## Out of Scope

- Backend route implementation
- Backend response schema changes
- Market trade detail page
- Market trade mutations
- Table filtering or sorting
- Documentation outside the selected feature contract and card

## Completion Notes

