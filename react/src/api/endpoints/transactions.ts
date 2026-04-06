import { apiClient } from "../client";
import type { Transaction } from "../../types/models/transaction.types";
import {
  getTransactionDetailEndpoint,
  getTransactionsByToUuidEndpoint,
  getTransactionsByFromUuidEndpoint,
} from "./transactionPaths";

export const transactionsApi = {
  getAll: () => apiClient<Transaction[]>("/api/transactions"),
  getById: (id: string) =>
    apiClient<Transaction>(getTransactionDetailEndpoint(id)),
  getByToUuid: (uuid: string) =>
    apiClient<Transaction[]>(getTransactionsByToUuidEndpoint(uuid)),
  getByFromUuid: (uuid: string) =>
    apiClient<Transaction[]>(getTransactionsByFromUuidEndpoint(uuid)),
};
