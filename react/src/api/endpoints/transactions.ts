import { apiClient } from "../client";
import type { Transaction } from "../../types/models/transaction.types";
import { getTransactionDetailEndpoint } from "./transactionPaths";

export const transactionsApi = {
  getAll: () => apiClient<Transaction[]>("/api/transactions"),
  getById: (id: string) =>
    apiClient<Transaction>(getTransactionDetailEndpoint(id)),
  getByToUuid: (uuid: string) =>
    apiClient<Transaction[]>(`/api/transactions/to/${uuid}`),
  getByFromUuid: (uuid: string) =>
    apiClient<Transaction[]>(`/api/transactions/from/${uuid}`),
};
