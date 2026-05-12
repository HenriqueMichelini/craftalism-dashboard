export type MarketTrade = {
  id: string;
  type: "buy" | "sell";
  playerUuid: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
};

export type ApiMarketTradeHistory = {
  id: number | string;
  playerUuid: string;
  itemId: string;
  side: "BUY" | "SELL" | "buy" | "sell";
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
  executedAt: string;
};

export type ApiMarketTradeHistoryPage = {
  content: ApiMarketTradeHistory[];
};

export type MarketTradeTypeFilter = "buy" | "sell";

type FilterValue = string | number | null | undefined;

export type MarketTradeFilters = {
  type?: MarketTradeTypeFilter;
  playerUuid?: FilterValue;
  itemId?: FilterValue;
  matchMode?: "contains" | "exact";
  minTotalPrice?: FilterValue;
  maxTotalPrice?: FilterValue;
  createdFrom?: FilterValue;
  createdTo?: FilterValue;
};
