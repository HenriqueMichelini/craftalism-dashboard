import { test } from "node:test";
import * as assert from "node:assert/strict";
import {
  getTransactionDetailEndpoint,
  getTransactionsByToUuidEndpoint,
  getTransactionsByFromUuidEndpoint,
} from "../../src/api/endpoints/transactionPaths.js";

test("getTransactionDetailEndpoint returns canonical /api/transactions/{id} route", () => {
  assert.equal(
    getTransactionDetailEndpoint("abc-123"),
    "/api/transactions/abc-123",
  );
});

test("getTransactionsByToUuidEndpoint returns canonical /api/transactions/to/{uuid} route", () => {
  assert.equal(
    getTransactionsByToUuidEndpoint("player-uuid"),
    "/api/transactions/to/player-uuid",
  );
});

test("getTransactionsByFromUuidEndpoint returns canonical /api/transactions/from/{uuid} route", () => {
  assert.equal(
    getTransactionsByFromUuidEndpoint("player-uuid"),
    "/api/transactions/from/player-uuid",
  );
});
