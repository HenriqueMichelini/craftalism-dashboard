import { apiClient, buildEndpointWithQuery } from "../client.js";
import type {
  ApiMarketTradeHistory,
  ApiMarketTradeHistoryPage,
  MarketTrade,
  MarketTradeFilters,
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

function hasValue(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  return typeof value === "string" ? value.trim().length > 0 : true;
}

export function getMarketTradesEndpoint(
  filters: MarketTradeFilters = {},
): string {
  const matchMode = filters.matchMode ?? "contains";

  return buildEndpointWithQuery(MARKET_TRADES_ENDPOINT, {
    side: filters.type ? filters.type.toUpperCase() : undefined,
    playerUuid: filters.playerUuid,
    playerUuidMatch: hasValue(filters.playerUuid) ? matchMode : undefined,
    itemId: filters.itemId,
    itemIdMatch: hasValue(filters.itemId) ? matchMode : undefined,
    minTotalPrice: filters.minTotalPrice,
    maxTotalPrice: filters.maxTotalPrice,
    executedFrom: filters.createdFrom,
    executedTo: filters.createdTo,
  });
}

export const marketTradesApi = {
  getAll: async (filters: MarketTradeFilters = {}) =>
    toMarketTrades(
      await apiClient<ApiMarketTradeHistoryPage | ApiMarketTradeHistory[]>(
        getMarketTradesEndpoint(filters),
      ),
    ),
};
