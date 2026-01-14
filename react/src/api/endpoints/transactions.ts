import { apiClient } from "../client";
import type { Transaction } from "../../types/models/transaction.types";

export const transactionsApi = {
  getAll: () => apiClient<Transaction[]>("/api/transactions"),
  getById: (id: string) => apiClient<Transaction>(`/api/transactions/${id}`),
  getByToUuid: (uuid: string) =>
    apiClient<Transaction[]>(`/api/transactions/to/${uuid}`),
  getByFromUuid: (uuid: string) =>
    apiClient<Transaction[]>(`/api/transactions/from/${uuid}`),
};
