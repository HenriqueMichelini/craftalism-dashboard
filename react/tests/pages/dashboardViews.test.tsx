import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardPage } from "../../src/pages/Dashboard/DashboardPage.js";
import { BalancesView } from "../../src/pages/Dashboard/views/BalancesView/BalancesView.js";
import { PlayersView } from "../../src/pages/Dashboard/views/PlayersView/PlayersView.js";
import { TransactionsView } from "../../src/pages/Dashboard/views/TransactionsView/TransactionsView.js";

test("DashboardPage defaults to the players view and exposes all tabs", () => {
  const markup = renderToStaticMarkup(<DashboardPage />);

  assert.match(markup, /Players/);
  assert.match(markup, /Transactions/);
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
  assert.match(markup, /Loading data\.\.\./);
});
