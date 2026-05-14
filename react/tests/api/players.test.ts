import { test } from "node:test";
import * as assert from "node:assert/strict";
import { playersApi } from "../../src/api/endpoints/players.js";

const player = {
  uuid: "018f6b86-7a4b-7c1f-9a7c-2d7850425f21",
  name: "Ada",
  createdAt: "2026-05-01T00:00:00.000Z",
};

test("playersApi.create sends player create request through dashboard BFF", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(input), init });

    return Promise.resolve(
      new Response(JSON.stringify(player), {
        headers: { "content-type": "application/json" },
        status: 201,
      }),
    );
  }) as typeof fetch;

  try {
    const response = await playersApi.create({
      uuid: player.uuid,
      name: player.name,
    });

    assert.deepEqual(response, player);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(requests[0]?.url, "/api/dashboard/players");
  assert.notEqual(requests[0]?.url, "/api/players");
  assert.equal(requests[0]?.init?.method, "POST");
  assert.equal(
    requests[0]?.init?.body,
    JSON.stringify({ uuid: player.uuid, name: player.name }),
  );
});

test("playersApi.update and delete use dashboard BFF player resource route", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(input), init });

    const body = init?.method === "DELETE" ? null : JSON.stringify(player);

    return Promise.resolve(
      new Response(body, {
        headers: { "content-type": "application/json" },
        status: init?.method === "DELETE" ? 204 : 200,
      }),
    );
  }) as typeof fetch;

  try {
    await playersApi.update(player.uuid, { name: "Ada Lovelace" });
    await playersApi.delete(player.uuid);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(requests[0]?.url, `/api/dashboard/players/${player.uuid}`);
  assert.notEqual(requests[0]?.url, `/api/players/${player.uuid}`);
  assert.equal(requests[0]?.init?.method, "PATCH");
  assert.equal(
    requests[0]?.init?.body,
    JSON.stringify({ name: "Ada Lovelace" }),
  );
  assert.equal(requests[1]?.url, `/api/dashboard/players/${player.uuid}`);
  assert.notEqual(requests[1]?.url, `/api/players/${player.uuid}`);
  assert.equal(requests[1]?.init?.method, "DELETE");
});
