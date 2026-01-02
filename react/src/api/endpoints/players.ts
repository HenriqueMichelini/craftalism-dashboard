import { apiClient } from "../client";
import type { Player } from "../../types/models/player.types";

export const playersApi = {
  getAll: () => apiClient<Player[]>("/api/players"),
  getById: (uuid: string) => apiClient<Player>(`/api/players/${uuid}`),
  create: (player: Omit<Player, "uuid" | "createdAt">) =>
    apiClient<Player>("/api/players", {
      method: "POST",
      body: JSON.stringify(player),
    }),
  // update: (uuid: string, player: Partial<Player>) =>
  //   apiClient<Player>(`/api/players/${uuid}`, {
  //     method: "PATCH",
  //     body: JSON.stringify(player),
  //   }),
  // delete: (uuid: string) =>
  //   apiClient<void>(`/api/players/${uuid}`, { method: "DELETE" }),
};
