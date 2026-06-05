import type { Player } from "../../../../types/models/player.types.js";

export type PlayerFormValues = {
  uuid: string;
  name: string;
};

export type PlayerValidationResult =
  | { valid: true; values: PlayerFormValues }
  | { valid: false; errors: Partial<Record<keyof PlayerFormValues, string>> };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value.trim());
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
  } else if (!isUuid(uuid)) {
    errors.uuid = "Player UUID must be a valid UUID value.";
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
