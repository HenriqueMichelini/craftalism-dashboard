import { apiClient } from "../client.js";
import type { MarketTrade } from "../../types/models/marketTrade.types.js";

export const MARKET_TRADES_ENDPOINT = "/api/market/trades";

export const marketTradesApi = {
  getAll: () => apiClient<MarketTrade[]>(MARKET_TRADES_ENDPOINT),
};
