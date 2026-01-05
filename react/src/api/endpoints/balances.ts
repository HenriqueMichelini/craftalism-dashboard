import { apiClient } from "../client";
import type { Balance } from "../../types/models/balance.types";

export const balancesApi = {
  getAll: () => apiClient<Balance[]>("/api/balances"),
  getById: (uuid: string) => apiClient<Balance>(`/api/balances/${uuid}`),
};
