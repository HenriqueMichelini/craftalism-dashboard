import { test } from "node:test";
import * as assert from "node:assert/strict";
import { loadTableData } from "../../src/hooks/tableDataState.js";
test("loadTableData returns populated state on success", async () => {
    const result = await loadTableData(async () => [{ id: 1 }, { id: 2 }]);
    assert.deepEqual(result, {
        data: [{ id: 1 }, { id: 2 }],
        loading: false,
        error: null,
    });
});
test("loadTableData normalizes thrown errors into table error state", async () => {
    const result = await loadTableData(async () => {
        throw new Error("network down");
    });
    assert.deepEqual(result, {
        data: [],
        loading: false,
        error: "network down",
    });
});
