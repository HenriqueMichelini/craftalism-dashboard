import { test } from "node:test";
import * as assert from "node:assert/strict";
import {
  getTransactionsEndpoint,
  getTransactionDetailEndpoint,
  getTransactionsByToUuidEndpoint,
  getTransactionsByFromUuidEndpoint,
} from "../../src/api/endpoints/transactionPaths.js";

test("getTransactionDetailEndpoint returns canonical /api/transactions/{id} route", () => {
  assert.equal(getTransactionDetailEndpoint("abc-123"), "/api/transactions/abc-123");
});

test("transaction list and filter route builders stay aligned to /api/transactions", () => {
  assert.equal(getTransactionsEndpoint(), "/api/transactions");
  assert.equal(
    getTransactionsByToUuidEndpoint("to-uuid"),
    "/api/transactions/to/to-uuid",
  );
  assert.equal(
    getTransactionsByFromUuidEndpoint("from-uuid"),
    "/api/transactions/from/from-uuid",
  );
});
