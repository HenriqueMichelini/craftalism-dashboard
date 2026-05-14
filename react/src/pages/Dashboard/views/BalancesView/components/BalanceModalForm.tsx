import { useState } from "react";
import type { FormEvent } from "react";
import { ModalShell } from "../../../../../components/ui/ModalShell.js";
import type { Balance } from "../../../../../types/models/balance.types.js";
import {
  toBalanceFormAmount,
  validateBalanceForm,
  type BalanceFormValues,
} from "../balanceValidation.js";

type BalanceModalFormProps = {
  mode: "create" | "edit";
  balance?: Balance;
  playerUuids: string[];
  onCancel: () => void;
  onDelete?: (balance: Balance) => void;
  onSave: (balance: Balance) => void;
};

const fieldClass =
  "h-10 w-full rounded-md border border-primary-300 bg-primary-500 px-3 text-default outline-none focus:border-primary-100";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-muted";
const errorClass = "text-sm text-red-400";

export function BalanceModalForm({
  mode,
  balance,
  playerUuids,
  onCancel,
  onDelete,
  onSave,
}: BalanceModalFormProps) {
  const [values, setValues] = useState<BalanceFormValues>({
    uuid: balance?.uuid ?? "",
    amount: balance ? toBalanceFormAmount(balance.amount) : "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof BalanceFormValues, string>>
  >({});

  const title = mode === "create" ? "Create Balance" : "Edit Balance";

  const updateValue = (key: keyof BalanceFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateBalanceForm(values, playerUuids);

    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    onSave({
      uuid: result.values.uuid,
      amount: result.values.amount,
      status: balance?.status,
    });
  };

  return (
    <ModalShell
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button
            className="rounded-md border border-primary-300 px-4 py-2 text-sm font-medium text-default hover:bg-primary-400"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          {mode === "edit" && balance ? (
            <button
              className="rounded-md border border-red-400 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
              type="button"
              onClick={() => onDelete?.(balance)}
            >
              Delete
            </button>
          ) : null}
          <button
            className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
            form="balance-modal-form"
            type="submit"
          >
            Save
          </button>
        </>
      }
    >
      <form
        className="space-y-4"
        id="balance-modal-form"
        onSubmit={handleSubmit}
      >
        <label className={labelClass}>
          Player UUID
          <input
            className={fieldClass}
            name="uuid"
            type="text"
            value={values.uuid}
            onChange={(event) => updateValue("uuid", event.target.value)}
          />
          {errors.uuid ? (
            <span className={errorClass}>{errors.uuid}</span>
          ) : null}
        </label>
        <label className={labelClass}>
          Amount
          <input
            className={fieldClass}
            name="amount"
            step="any"
            type="number"
            value={values.amount}
            onChange={(event) => updateValue("amount", event.target.value)}
          />
          {errors.amount ? (
            <span className={errorClass}>{errors.amount}</span>
          ) : null}
        </label>
      </form>
    </ModalShell>
  );
}
