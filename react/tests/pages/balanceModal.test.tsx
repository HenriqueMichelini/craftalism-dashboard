import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { BalanceModalForm } from "../../src/pages/Dashboard/views/BalancesView/components/BalanceModalForm.js";
import {
  toBalanceFormAmount,
  validateBalanceForm,
} from "../../src/pages/Dashboard/views/BalancesView/balanceValidation.js";
import type { Balance } from "../../src/types/models/balance.types.js";

const playerUuid = "018f6b86-7a4b-7c1f-9a7c-2d7850425f21";
const balance: Balance = {
  uuid: playerUuid,
  amount: 125000,
};

test("validateBalanceForm rejects missing player references", () => {
  const result = validateBalanceForm(
    { uuid: "018f6b87-5a37-7c20-a0e3-58a721de478a", amount: "12.50" },
    [playerUuid],
  );

  assert.equal(result.valid, false);
  assert.equal(
    result.valid ? undefined : result.errors.uuid,
    "Player UUID must match an existing player.",
  );
});

test("validateBalanceForm rejects invalid amount values", () => {
  const result = validateBalanceForm(
    { uuid: playerUuid, amount: "12.cats" },
    [playerUuid],
  );

  assert.equal(result.valid, false);
  assert.equal(
    result.valid ? undefined : result.errors.amount,
    "Balance amount must be a valid number.",
  );
});

test("validateBalanceForm rejects missing balance amount", () => {
  const result = validateBalanceForm({ uuid: playerUuid, amount: " " }, [
    playerUuid,
  ]);

  assert.equal(result.valid, false);
  assert.equal(
    result.valid ? undefined : result.errors.amount,
    "Balance amount is required.",
  );
});

test("validateBalanceForm preserves decimal amount scaling", () => {
  const result = validateBalanceForm(
    { uuid: playerUuid, amount: "12.50" },
    [playerUuid],
  );

  assert.deepEqual(result, {
    valid: true,
    values: {
      uuid: playerUuid,
      amount: 125000,
    },
  });
  assert.equal(toBalanceFormAmount(125000), "12.5");
});

test("BalanceModalForm renders create and edit modes with expected fields", () => {
  const createMarkup = renderToStaticMarkup(
    <BalanceModalForm
      mode="create"
      playerUuids={[playerUuid]}
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );
  const editMarkup = renderToStaticMarkup(
    <BalanceModalForm
      mode="edit"
      balance={balance}
      playerUuids={[playerUuid]}
      onCancel={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(createMarkup, /Create Balance/);
  assert.match(createMarkup, /Player UUID/);
  assert.match(createMarkup, /Amount/);
  assert.doesNotMatch(createMarkup, /Delete/);
  assert.match(editMarkup, /Edit Balance/);
  assert.match(editMarkup, /Delete/);
  assert.match(editMarkup, /value="018f6b86-7a4b-7c1f-9a7c-2d7850425f21"/);
  assert.match(editMarkup, /value="12.5"/);
});
