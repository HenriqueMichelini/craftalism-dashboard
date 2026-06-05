import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PlayerModalForm } from "../../src/pages/Dashboard/views/PlayersView/components/PlayerModalForm.js";
import {
  isUuid,
  validatePlayerForm,
} from "../../src/pages/Dashboard/views/PlayersView/playerValidation.js";
import type { Player } from "../../src/types/models/player.types.js";

const player: Player = {
  uuid: "018f6b86-7a4b-7c1f-9a7c-2d7850425f21",
  name: "Ada",
  createdAt: "2026-05-01T00:00:00.000Z",
};

test("isUuid accepts canonical UUID values regardless of version", () => {
  assert.equal(isUuid("c06f8906-4c8a-3f9b-9e8c-2f3f95a4e3c4"), true);
  assert.equal(isUuid("550e8400-e29b-41d4-a716-446655440000"), true);
  assert.equal(isUuid("018f6b86-7a4b-7c1f-9a7c-2d7850425f21"), true);
  assert.equal(isUuid("550e8400e29b41d4a716446655440000"), false);
  assert.equal(isUuid("not-a-uuid"), false);
});

test("validatePlayerForm rejects duplicate player UUIDs on create", () => {
  const result = validatePlayerForm(
    { uuid: player.uuid, name: "Grace" },
    [player],
    { mode: "create" },
  );

  assert.equal(result.valid, false);
  assert.equal(
    result.valid ? undefined : result.errors.uuid,
    "A player with this UUID already exists.",
  );
});

test("validatePlayerForm rejects missing and malformed player UUIDs", () => {
  const missingUuid = validatePlayerForm(
    { uuid: " ", name: "Grace" },
    [],
    { mode: "create" },
  );
  const invalidUuid = validatePlayerForm(
    { uuid: "550e8400e29b41d4a716446655440000", name: "Grace" },
    [],
    { mode: "create" },
  );

  assert.equal(missingUuid.valid, false);
  assert.equal(
    missingUuid.valid ? undefined : missingUuid.errors.uuid,
    "Player UUID is required.",
  );
  assert.equal(invalidUuid.valid, false);
  assert.equal(
    invalidUuid.valid ? undefined : invalidUuid.errors.uuid,
    "Player UUID must be a valid UUID value.",
  );
});

test("validatePlayerForm allows edit mode to keep the same player UUID", () => {
  const result = validatePlayerForm(
    { uuid: player.uuid, name: "Ada Lovelace" },
    [player],
    { mode: "edit", originalUuid: player.uuid },
  );

  assert.deepEqual(result, {
    valid: true,
    values: {
      uuid: player.uuid,
      name: "Ada Lovelace",
    },
  });
});

test("PlayerModalForm renders create and edit modes with expected fields", () => {
  const createMarkup = renderToStaticMarkup(
    <PlayerModalForm
      mode="create"
      players={[player]}
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );
  const editMarkup = renderToStaticMarkup(
    <PlayerModalForm
      mode="edit"
      player={player}
      players={[player]}
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(createMarkup, /Create Player/);
  assert.match(createMarkup, /Player UUID/);
  assert.match(createMarkup, /Name/);
  assert.doesNotMatch(createMarkup, /Delete/);
  assert.match(editMarkup, /Edit Player/);
  assert.match(editMarkup, /Delete/);
  assert.match(editMarkup, /readOnly=""/);
  assert.match(editMarkup, /value="018f6b86-7a4b-7c1f-9a7c-2d7850425f21"/);
  assert.match(editMarkup, /value="Ada"/);
});
