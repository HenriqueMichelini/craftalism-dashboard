import { apiClient } from "../client.js";
import type {
  MarketDriftResetResponse,
  MarketItem,
  MarketItemCreateRequest,
  MarketItemUpdateRequest,
} from "../../types/models/marketItem.types.js";

const MARKET_ITEMS_ROUTE = "/api/dashboard/market/items";
const MARKET_DRIFT_RESET_ROUTE = "/api/dashboard/market/drift/reset";

export const marketItemsApi = {
  getAll: () => apiClient<MarketItem[]>(MARKET_ITEMS_ROUTE),
  create: (item: MarketItemCreateRequest) =>
    apiClient<MarketItem>(MARKET_ITEMS_ROUTE, {
      method: "POST",
      body: JSON.stringify(item),
    }),
  update: (itemId: string, item: MarketItemUpdateRequest) =>
    apiClient<MarketItem>(
      `${MARKET_ITEMS_ROUTE}/${encodeURIComponent(itemId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(item),
      },
    ),
  delete: (itemId: string) =>
    apiClient<void>(`${MARKET_ITEMS_ROUTE}/${encodeURIComponent(itemId)}`, {
      method: "DELETE",
    }),
  resetDrift: () =>
    apiClient<MarketDriftResetResponse>(MARKET_DRIFT_RESET_ROUTE, {
      method: "POST",
    }),
};
