import assert from "node:assert/strict";
import { test } from "node:test";
import { ApiError } from "../../src/api/client.js";
import { submitMarketDriftReset } from "../../src/pages/Dashboard/views/MarketItemsView/marketDriftResetAction.js";

function createActionState() {
  const state = {
    submitting: false,
    successMessage: null as string | null,
    errorMessage: null as string | null,
    submittingTransitions: [] as boolean[],
  };

  return {
    state,
    setSubmitting: (submitting: boolean) => {
      state.submitting = submitting;
      state.submittingTransitions.push(submitting);
    },
    setSuccessMessage: (message: string | null) => {
      state.successMessage = message;
    },
    setErrorMessage: (message: string | null) => {
      state.errorMessage = message;
    },
  };
}

test("submitMarketDriftReset requires confirmation before submitting", async () => {
  const actionState = createActionState();
  let resetCalls = 0;
  let refreshCalls = 0;

  await submitMarketDriftReset({
    isSubmitting: () => false,
    confirm: () => false,
    resetDrift: async () => {
      resetCalls += 1;
      return {
        resetItemCount: 1,
        driftMultiplierBasisPoints: 10000,
        driftEvaluatedAt: "2026-05-28T12:00:00.000Z",
      };
    },
    refreshRows: async () => {
      refreshCalls += 1;
    },
    setSubmitting: actionState.setSubmitting,
    setSuccessMessage: actionState.setSuccessMessage,
    setErrorMessage: actionState.setErrorMessage,
  });

  assert.equal(resetCalls, 0);
  assert.equal(refreshCalls, 0);
  assert.deepEqual(actionState.state.submittingTransitions, []);
});

test("submitMarketDriftReset prevents duplicate submissions", async () => {
  const actionState = createActionState();
  let resetCalls = 0;

  await submitMarketDriftReset({
    isSubmitting: () => true,
    confirm: () => {
      throw new Error("confirmation should not run while submitting");
    },
    resetDrift: async () => {
      resetCalls += 1;
      return {
        resetItemCount: 1,
        driftMultiplierBasisPoints: 10000,
        driftEvaluatedAt: "2026-05-28T12:00:00.000Z",
      };
    },
    refreshRows: async () => {},
    setSubmitting: actionState.setSubmitting,
    setSuccessMessage: actionState.setSuccessMessage,
    setErrorMessage: actionState.setErrorMessage,
  });

  assert.equal(resetCalls, 0);
  assert.deepEqual(actionState.state.submittingTransitions, []);
});

test("submitMarketDriftReset reports reset count and refreshes rows after success", async () => {
  const actionState = createActionState();
  const events: string[] = [];

  await submitMarketDriftReset({
    isSubmitting: () => false,
    confirm: () => true,
    resetDrift: async () => {
      events.push("reset");
      return {
        resetItemCount: 2,
        driftMultiplierBasisPoints: 10000,
        driftEvaluatedAt: "2026-05-28T12:00:00.000Z",
      };
    },
    refreshRows: async () => {
      events.push("refresh");
    },
    setSubmitting: actionState.setSubmitting,
    setSuccessMessage: actionState.setSuccessMessage,
    setErrorMessage: actionState.setErrorMessage,
  });

  assert.deepEqual(events, ["reset", "refresh"]);
  assert.equal(actionState.state.successMessage, "Reset drift for 2 market items.");
  assert.equal(actionState.state.errorMessage, null);
  assert.deepEqual(actionState.state.submittingTransitions, [true, false]);
});

test("submitMarketDriftReset surfaces API errors without refreshing rows", async () => {
  const actionState = createActionState();
  let refreshCalls = 0;

  await submitMarketDriftReset({
    isSubmitting: () => false,
    confirm: () => true,
    resetDrift: async () => {
      throw new Error("reset failed");
    },
    refreshRows: async () => {
      refreshCalls += 1;
    },
    setSubmitting: actionState.setSubmitting,
    setSuccessMessage: actionState.setSuccessMessage,
    setErrorMessage: actionState.setErrorMessage,
  });

  assert.equal(refreshCalls, 0);
  assert.equal(actionState.state.successMessage, null);
  assert.equal(actionState.state.errorMessage, "reset failed");
  assert.deepEqual(actionState.state.submittingTransitions, [true, false]);
});

test("submitMarketDriftReset treats auth failures as the admin-auth boundary", async () => {
  const actionState = createActionState();

  await submitMarketDriftReset({
    isSubmitting: () => false,
    confirm: () => true,
    resetDrift: async () => {
      throw new ApiError("Forbidden", 403, "Forbidden");
    },
    refreshRows: async () => {},
    setSubmitting: actionState.setSubmitting,
    setSuccessMessage: actionState.setSuccessMessage,
    setErrorMessage: actionState.setErrorMessage,
  });

  assert.equal(
    actionState.state.errorMessage,
    "Admin authorization is required to reset market drift.",
  );
});
