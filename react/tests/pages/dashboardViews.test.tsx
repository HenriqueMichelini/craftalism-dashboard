import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardPage } from "../../src/pages/Dashboard/DashboardPage.js";
import { BalancesView } from "../../src/pages/Dashboard/views/BalancesView/BalancesView.js";
import { MarketCategoriesView } from "../../src/pages/Dashboard/views/MarketCategoriesView/MarketCategoriesView.js";
import { MarketEventsView } from "../../src/pages/Dashboard/views/MarketEventsView/MarketEventsView.js";
import { MarketItemsView } from "../../src/pages/Dashboard/views/MarketItemsView/MarketItemsView.js";
import { MarketTradesView } from "../../src/pages/Dashboard/views/MarketTradesView/MarketTradesView.js";
import {
  getMarketTradeEmptyMessage,
  hasActiveMarketTradeFilters,
  toMarketTradeApiFilters,
} from "../../src/pages/Dashboard/views/MarketTradesView/filterConfig.js";
import { PlayersView } from "../../src/pages/Dashboard/views/PlayersView/PlayersView.js";
import { TransactionsView } from "../../src/pages/Dashboard/views/TransactionsView/TransactionsView.js";
import {
  getTransactionEmptyMessage,
  hasActiveTableFilters,
  toTransactionApiFilters,
} from "../../src/pages/Dashboard/views/TransactionsView/filterConfig.js";

test("DashboardPage defaults to the players view and exposes all tabs", () => {
  const markup = renderToStaticMarkup(<DashboardPage />);

  assert.match(markup, /Players/);
  assert.match(markup, /Transactions/);
  assert.match(markup, /Market Categories/);
  assert.match(markup, /Market Items/);
  assert.match(markup, /Market Trades/);
  assert.match(markup, /Market Events/);
  assert.match(markup, /Balances/);
  assert.match(markup, /Manage and view all registered players in your system\./);
  assert.doesNotMatch(
    markup,
    /Manage and view all registered balances in the server\./,
  );
});

test("PlayersView renders its header and loading table state", () => {
  const markup = renderToStaticMarkup(<PlayersView />);

  assert.match(markup, /Manage and view all registered players in your system\./);
  assert.match(markup, /Loading data\.\.\./);
});

test("BalancesView renders its header and loading table state", () => {
  const markup = renderToStaticMarkup(<BalancesView />);

  assert.match(markup, /Manage and view all registered balances in the server\./);
  assert.match(markup, /Loading data\.\.\./);
});

test("TransactionsView renders its header and loading table state", () => {
  const markup = renderToStaticMarkup(<TransactionsView />);

  assert.match(
    markup,
    /Manage and view all registered transactions in the server\./,
  );
  assert.match(markup, /From Player UUID/);
  assert.match(markup, /To Player UUID/);
  assert.match(markup, /Text Match/);
  assert.match(markup, /Amount/);
  assert.match(markup, /Loading data\.\.\./);
});

test("transaction filter helpers preserve draft-only and filtered-empty behavior", () => {
  assert.equal(hasActiveTableFilters({ fromPlayerUuid: "" }), false);
  assert.equal(hasActiveTableFilters({ fromPlayerUuid: "550e8400" }), true);
  assert.equal(getTransactionEmptyMessage(false), "No transactions found.");
  assert.equal(
    getTransactionEmptyMessage(true),
    "No records match the selected filters.",
  );
  assert.deepEqual(toTransactionApiFilters({ fromPlayerUuid: "550e8400" }), {
    fromPlayerUuid: "550e8400",
    toPlayerUuid: undefined,
    matchMode: "contains",
    minAmount: undefined,
    maxAmount: undefined,
    createdFrom: undefined,
    createdTo: undefined,
  });
});

test("MarketItemsView renders its header and loading table state", () => {
  const markup = renderToStaticMarkup(<MarketItemsView />);

  assert.match(
    markup,
    /Manage market item pricing, stock, regeneration, and state controls\./,
  );
  assert.match(markup, /Reset Drift/);
  assert.match(markup, /Loading data\.\.\./);
});

test("MarketCategoriesView renders its header and loading table state", () => {
  const markup = renderToStaticMarkup(<MarketCategoriesView />);

  assert.match(
    markup,
    /Manage API-owned market categories used by market items\./,
  );
  assert.match(markup, /Loading data\.\.\./);
});

test("MarketTradesView renders its header and loading table state", () => {
  const markup = renderToStaticMarkup(<MarketTradesView />);

  assert.match(
    markup,
    /View buy and sell market trade operations in the server\./,
  );
  assert.match(markup, /Type/);
  assert.match(markup, /Player UUID/);
  assert.match(markup, /Item ID/);
  assert.match(markup, /Text Match/);
  assert.match(markup, /Total Price/);
  assert.match(markup, /Loading data\.\.\./);
});

test("MarketEventsView renders its header and loading table state", () => {
  const markup = renderToStaticMarkup(<MarketEventsView />);

  assert.match(
    markup,
    /Inspect API-owned market event state for dashboard operations\./,
  );
  assert.match(markup, /Loading data\.\.\./);
});

test("market trade filter helpers map dashboard type to API filters", () => {
  assert.equal(hasActiveMarketTradeFilters({ type: "" }), false);
  assert.equal(hasActiveMarketTradeFilters({ type: "sell" }), true);
  assert.equal(getMarketTradeEmptyMessage(false), "No market trades found.");
  assert.equal(
    getMarketTradeEmptyMessage(true),
    "No records match the selected filters.",
  );
  assert.deepEqual(
    toMarketTradeApiFilters({
      type: "sell",
      itemId: "wheat",
      minTotalPrice: "80",
      maxTotalPrice: "90",
    }),
    {
      type: "sell",
      playerUuid: undefined,
      itemId: "wheat",
      matchMode: "contains",
      minTotalPrice: "800000",
      maxTotalPrice: "900000",
      createdFrom: undefined,
      createdTo: undefined,
    },
  );
});
