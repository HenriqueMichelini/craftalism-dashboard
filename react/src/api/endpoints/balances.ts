import { apiClient } from "../client.js";
import type { Balance } from "../../types/models/balance.types.js";

export type BalanceCreateRequest = {
  uuid: string;
  amount: number;
};

export type BalanceUpdateRequest = {
  amount: number;
};

export const balancesApi = {
  getAll: () => apiClient<Balance[]>("/api/balances"),
  getById: (uuid: string) => apiClient<Balance>(`/api/balances/${uuid}`),
  create: (balance: BalanceCreateRequest) =>
    apiClient<Balance>("/api/balances", {
      method: "POST",
      body: JSON.stringify(balance),
    }),
  update: (uuid: string, balance: BalanceUpdateRequest) =>
    apiClient<Balance>(`/api/balances/${uuid}`, {
      method: "PATCH",
      body: JSON.stringify(balance),
    }),
  delete: (uuid: string) =>
    apiClient<void>(`/api/balances/${uuid}`, { method: "DELETE" }),
};
