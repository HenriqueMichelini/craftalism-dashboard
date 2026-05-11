import { apiClient } from "../client.js";
import type {
  ApiMarketTradeHistory,
  ApiMarketTradeHistoryPage,
  MarketTrade,
} from "../../types/models/marketTrade.types.js";

export const MARKET_TRADES_ENDPOINT = "/api/market/trades";

function toMarketTrade(trade: ApiMarketTradeHistory): MarketTrade {
  return {
    id: String(trade.id),
    type: trade.side.toLowerCase() === "sell" ? "sell" : "buy",
    playerUuid: trade.playerUuid,
    itemId: trade.itemId,
    quantity: trade.quantity,
    unitPrice: Number(trade.unitPrice),
    totalPrice: Number(trade.totalPrice),
    createdAt: trade.executedAt,
  };
}

function toMarketTrades(
  response: ApiMarketTradeHistoryPage | ApiMarketTradeHistory[],
): MarketTrade[] {
  const trades = Array.isArray(response) ? response : response.content;

  return trades.map(toMarketTrade);
}

export const marketTradesApi = {
  getAll: async () =>
    toMarketTrades(
      await apiClient<ApiMarketTradeHistoryPage | ApiMarketTradeHistory[]>(
        MARKET_TRADES_ENDPOINT,
      ),
    ),
};
