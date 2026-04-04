import { test } from "node:test";
import * as assert from "node:assert/strict";
import { getTransactionDetailEndpoint } from "../../src/api/endpoints/transactionPaths.js";
test("getTransactionDetailEndpoint returns canonical /api/transactions/{id} route", () => {
    assert.equal(getTransactionDetailEndpoint("abc-123"), "/api/transactions/abc-123");
});
