import { apiClient } from "../client.js";
import type { Player } from "../../types/models/player.types.js";

export type PlayerCreateRequest = {
  uuid: string;
  name: string;
};

export type PlayerUpdateRequest = {
  name: string;
};

export const playersApi = {
  getAll: () => apiClient<Player[]>("/api/players"),
  getById: (uuid: string) => apiClient<Player>(`/api/players/${uuid}`),
  create: (player: PlayerCreateRequest) =>
    apiClient<Player>("/api/dashboard/players", {
      method: "POST",
      body: JSON.stringify(player),
    }),
  update: (uuid: string, player: PlayerUpdateRequest) =>
    apiClient<Player>(`/api/dashboard/players/${uuid}`, {
      method: "PATCH",
      body: JSON.stringify(player),
    }),
  delete: (uuid: string) =>
    apiClient<void>(`/api/dashboard/players/${uuid}`, { method: "DELETE" }),
};
