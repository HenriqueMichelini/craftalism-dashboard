import { apiClient } from "../client.js";
import type {
  MarketCategory,
  MarketCategoryCreateRequest,
  MarketCategoryUpdateRequest,
} from "../../types/models/marketCategory.types.js";

const MARKET_CATEGORIES_ROUTE = "/api/dashboard/market/categories";

export const marketCategoriesApi = {
  getAll: () => apiClient<MarketCategory[]>(MARKET_CATEGORIES_ROUTE),
  create: (category: MarketCategoryCreateRequest) =>
    apiClient<MarketCategory>(MARKET_CATEGORIES_ROUTE, {
      method: "POST",
      body: JSON.stringify(category),
    }),
  update: (categoryId: string, category: MarketCategoryUpdateRequest) =>
    apiClient<MarketCategory>(
      `${MARKET_CATEGORIES_ROUTE}/${encodeURIComponent(categoryId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(category),
      },
    ),
  delete: (categoryId: string) =>
    apiClient<void>(
      `${MARKET_CATEGORIES_ROUTE}/${encodeURIComponent(categoryId)}`,
      {
        method: "DELETE",
      },
    ),
};
