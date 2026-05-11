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
