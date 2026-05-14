import { useState } from "react";
import type { FormEvent } from "react";
import { ModalShell } from "../../../../../components/ui/ModalShell.js";
import type { Player } from "../../../../../types/models/player.types.js";
import {
  validatePlayerForm,
  type PlayerFormValues,
} from "../playerValidation.js";

type PlayerModalFormProps = {
  mode: "create" | "edit";
  players: Player[];
  player?: Player;
  actionError?: string | null;
  submitting?: boolean;
  onCancel: () => void;
  onDelete?: (player: Player) => void;
  onSave: (player: Player) => void;
};

const fieldClass =
  "h-10 w-full rounded-md border border-primary-300 bg-primary-500 px-3 text-default outline-none focus:border-primary-100 disabled:cursor-not-allowed disabled:text-muted";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-muted";
const errorClass = "text-sm text-red-400";

export function PlayerModalForm({
  mode,
  players,
  player,
  actionError = null,
  submitting = false,
  onCancel,
  onDelete,
  onSave,
}: PlayerModalFormProps) {
  const [values, setValues] = useState<PlayerFormValues>({
    uuid: player?.uuid ?? "",
    name: player?.name ?? "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PlayerFormValues, string>>
  >({});

  const title = mode === "create" ? "Create Player" : "Edit Player";

  const updateValue = (key: keyof PlayerFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validatePlayerForm(values, players, {
      mode,
      originalUuid: player?.uuid,
    });

    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    onSave({
      uuid: result.values.uuid,
      name: result.values.name,
      createdAt: player?.createdAt ?? new Date().toISOString(),
      status: player?.status,
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
            disabled={submitting}
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          {mode === "edit" && player ? (
            <button
              className="rounded-md border border-red-400 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
              disabled={submitting}
              type="button"
              onClick={() => onDelete?.(player)}
            >
              Delete
            </button>
          ) : null}
          <button
            className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
            disabled={submitting}
            form="player-modal-form"
            type="submit"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <form className="space-y-4" id="player-modal-form" onSubmit={handleSubmit}>
        {actionError ? <p className={errorClass}>{actionError}</p> : null}
        <label className={labelClass}>
          Player UUID
          <input
            className={fieldClass}
            name="uuid"
            readOnly={mode === "edit"}
            type="text"
            value={values.uuid}
            onChange={(event) => updateValue("uuid", event.target.value)}
          />
          {errors.uuid ? <span className={errorClass}>{errors.uuid}</span> : null}
        </label>
        <label className={labelClass}>
          Name
          <input
            className={fieldClass}
            name="name"
            type="text"
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
          />
          {errors.name ? <span className={errorClass}>{errors.name}</span> : null}
        </label>
      </form>
    </ModalShell>
  );
}
