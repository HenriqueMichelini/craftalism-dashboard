export type Transaction = {
  id: string;
  fromPlayerUuid: string;
  amount: number;
  toPlayerUuid: string;
  createdAt: string;
  status?: "active" | "inactive";
};

export type TextMatchMode = "contains" | "exact";

type FilterValue = string | number | null | undefined;

export type TransactionFilters = {
  fromPlayerUuid?: FilterValue;
  toPlayerUuid?: FilterValue;
  matchMode?: TextMatchMode;
  minAmount?: FilterValue;
  maxAmount?: FilterValue;
  createdFrom?: FilterValue;
  createdTo?: FilterValue;
};

export type ApiTransactionPage = {
  content: Transaction[];
};
