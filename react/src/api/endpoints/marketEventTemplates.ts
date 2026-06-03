import { apiClient } from "../client.js";
import type {
  MarketEventTemplate,
  MarketEventTemplateCreateRequest,
  MarketEventTemplateUpdateRequest,
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
  update: (templateId: string, request: MarketEventTemplateUpdateRequest) =>
    apiClient<MarketEventTemplate>(
      `${MARKET_EVENT_TEMPLATES_ENDPOINT}/${encodeURIComponent(templateId)}`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      },
    ),
  delete: (templateId: string) =>
    apiClient<void>(
      `${MARKET_EVENT_TEMPLATES_ENDPOINT}/${encodeURIComponent(templateId)}`,
      {
        method: "DELETE",
      },
    ),
};
