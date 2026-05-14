import type { Player } from "../../../../types/models/player.types.js";

export type PlayerFormValues = {
  uuid: string;
  name: string;
};

export type PlayerValidationResult =
  | { valid: true; values: PlayerFormValues }
  | { valid: false; errors: Partial<Record<keyof PlayerFormValues, string>> };

const UUID7_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid7(value: string): boolean {
  return UUID7_PATTERN.test(value.trim());
}

export function validatePlayerForm(
  values: PlayerFormValues,
  existingPlayers: Player[],
  options: { mode: "create" | "edit"; originalUuid?: string },
): PlayerValidationResult {
  const uuid = values.uuid.trim();
  const name = values.name.trim();
  const errors: Partial<Record<keyof PlayerFormValues, string>> = {};

  if (!uuid) {
    errors.uuid = "Player UUID is required.";
  } else if (!isUuid7(uuid)) {
    errors.uuid = "Player UUID must be a valid UUID7 value.";
  }

  const duplicatePlayer = existingPlayers.find(
    (player) => player.uuid.toLowerCase() === uuid.toLowerCase(),
  );

  if (
    duplicatePlayer &&
    (options.mode === "create" ||
      duplicatePlayer.uuid.toLowerCase() !==
        options.originalUuid?.toLowerCase())
  ) {
    errors.uuid = "A player with this UUID already exists.";
  }

  if (!name) {
    errors.name = "Player name is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, values: { uuid, name } };
}
