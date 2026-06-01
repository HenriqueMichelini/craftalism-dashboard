import { apiClient } from "../client.js";
import type {
  MarketEventTemplate,
  MarketEventTemplateCreateRequest,
} from "../../types/models/marketEventTemplate.types.js";

export const MARKET_EVENT_TEMPLATES_ENDPOINT =
  "/api/dashboard/market/event-templates";

export const marketEventTemplatesApi = {
  getAll: () =>
    apiClient<MarketEventTemplate[]>(MARKET_EVENT_TEMPLATES_ENDPOINT),
  create: (request: MarketEventTemplateCreateRequest) =>
    apiClient<MarketEventTemplate>(MARKET_EVENT_TEMPLATES_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(request),
    }),
};
