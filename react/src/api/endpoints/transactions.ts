import { apiClient, buildEndpointWithQuery } from "../client.js";
import type {
  ApiTransactionPage,
  Transaction,
  TransactionFilters,
} from "../../types/models/transaction.types.js";
import {
  getTransactionDetailEndpoint,
  getTransactionsByToUuidEndpoint,
  getTransactionsByFromUuidEndpoint,
} from "./transactionPaths.js";

export const TRANSACTIONS_ENDPOINT = "/api/transactions";

function hasValue(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  return typeof value === "string" ? value.trim().length > 0 : true;
}

export function getTransactionsEndpoint(
  filters: TransactionFilters = {},
): string {
  const matchMode = filters.matchMode ?? "contains";

  return buildEndpointWithQuery(TRANSACTIONS_ENDPOINT, {
    fromPlayerUuid: filters.fromPlayerUuid,
    fromPlayerUuidMatch: hasValue(filters.fromPlayerUuid)
      ? matchMode
      : undefined,
    toPlayerUuid: filters.toPlayerUuid,
    toPlayerUuidMatch: hasValue(filters.toPlayerUuid) ? matchMode : undefined,
    minAmount: filters.minAmount,
    maxAmount: filters.maxAmount,
    createdFrom: filters.createdFrom,
    createdTo: filters.createdTo,
  });
}

function toTransactions(response: Transaction[] | ApiTransactionPage) {
  return Array.isArray(response) ? response : response.content;
}

export const transactionsApi = {
  getAll: async (filters: TransactionFilters = {}) =>
    toTransactions(
      await apiClient<Transaction[] | ApiTransactionPage>(
        getTransactionsEndpoint(filters),
      ),
    ),
  getById: (id: string) =>
    apiClient<Transaction>(getTransactionDetailEndpoint(id)),
  getByToUuid: (uuid: string) =>
    apiClient<Transaction[]>(getTransactionsByToUuidEndpoint(uuid)),
  getByFromUuid: (uuid: string) =>
    apiClient<Transaction[]>(getTransactionsByFromUuidEndpoint(uuid)),
};
