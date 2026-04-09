import { apiClient } from "../client.js";
import type { Balance } from "../../types/models/balance.types.js";

export const balancesApi = {
  getAll: () => apiClient<Balance[]>("/api/balances"),
  getById: (uuid: string) => apiClient<Balance>(`/api/balances/${uuid}`),
};
