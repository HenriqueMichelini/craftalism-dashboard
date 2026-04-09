import { apiClient } from "../client.js";
import type { Transaction } from "../../types/models/transaction.types.js";
import {
  getTransactionDetailEndpoint,
  getTransactionsByToUuidEndpoint,
  getTransactionsByFromUuidEndpoint,
} from "./transactionPaths.js";

export const transactionsApi = {
  getAll: () => apiClient<Transaction[]>("/api/transactions"),
  getById: (id: string) =>
    apiClient<Transaction>(getTransactionDetailEndpoint(id)),
  getByToUuid: (uuid: string) =>
    apiClient<Transaction[]>(getTransactionsByToUuidEndpoint(uuid)),
  getByFromUuid: (uuid: string) =>
    apiClient<Transaction[]>(getTransactionsByFromUuidEndpoint(uuid)),
};
