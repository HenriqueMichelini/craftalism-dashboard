import { test } from "node:test";
import * as assert from "node:assert/strict";
import { balancesApi } from "../../src/api/endpoints/balances.js";

const balance = {
  uuid: "018f6b86-7a4b-7c1f-9a7c-2d7850425f21",
  amount: 125000,
};

test("balancesApi.create sends canonical balance create request", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(input), init });

    return Promise.resolve(
      new Response(JSON.stringify(balance), {
        headers: { "content-type": "application/json" },
        status: 201,
      }),
    );
  }) as typeof fetch;

  try {
    const response = await balancesApi.create(balance);

    assert.deepEqual(response, balance);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(requests[0]?.url, "/api/balances");
  assert.equal(requests[0]?.init?.method, "POST");
  assert.equal(requests[0]?.init?.body, JSON.stringify(balance));
});

test("balancesApi.update and delete use canonical balance resource route", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(input), init });

    const body = init?.method === "DELETE" ? null : JSON.stringify(balance);

    return Promise.resolve(
      new Response(body, {
        headers: { "content-type": "application/json" },
        status: init?.method === "DELETE" ? 204 : 200,
      }),
    );
  }) as typeof fetch;

  try {
    await balancesApi.update(balance.uuid, { amount: 130000 });
    await balancesApi.delete(balance.uuid);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(requests[0]?.url, `/api/balances/${balance.uuid}`);
  assert.equal(requests[0]?.init?.method, "PATCH");
  assert.equal(requests[0]?.init?.body, JSON.stringify({ amount: 130000 }));
  assert.equal(requests[1]?.url, `/api/balances/${balance.uuid}`);
  assert.equal(requests[1]?.init?.method, "DELETE");
});
