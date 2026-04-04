import { apiClient } from "../client";
import type { Transaction } from "../../types/models/transaction.types";
import {
  getTransactionsEndpoint,
  getTransactionDetailEndpoint,
  getTransactionsByToUuidEndpoint,
  getTransactionsByFromUuidEndpoint,
} from "./transactionPaths";

export const transactionsApi = {
  getAll: () => apiClient<Transaction[]>(getTransactionsEndpoint()),
  getById: (id: string) =>
    apiClient<Transaction>(getTransactionDetailEndpoint(id)),
  getByToUuid: (uuid: string) =>
    apiClient<Transaction[]>(getTransactionsByToUuidEndpoint(uuid)),
  getByFromUuid: (uuid: string) =>
    apiClient<Transaction[]>(getTransactionsByFromUuidEndpoint(uuid)),
};
