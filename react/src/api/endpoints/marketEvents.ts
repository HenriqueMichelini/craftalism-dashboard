import { apiClient } from "../client.js";
import type {
  ApiMarketEvent,
  MarketEvent,
  MarketEventCancelRequest,
  MarketEventCreateRequest,
  MarketEventUpdateRequest,
} from "../../types/models/marketEvent.types.js";

export const MARKET_EVENTS_ENDPOINT = "/api/dashboard/market/events";

function toMarketEvent(event: ApiMarketEvent): MarketEvent {
  return {
    ...event,
    id: String(event.id),
  };
}

export const marketEventsApi = {
  getAll: async () =>
    (await apiClient<ApiMarketEvent[]>(MARKET_EVENTS_ENDPOINT)).map(
      toMarketEvent,
    ),
  create: async (request: MarketEventCreateRequest) =>
    toMarketEvent(
      await apiClient<ApiMarketEvent>(MARKET_EVENTS_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    ),
  update: async (id: string, request: MarketEventUpdateRequest) =>
    toMarketEvent(
      await apiClient<ApiMarketEvent>(
        `${MARKET_EVENTS_ENDPOINT}/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          body: JSON.stringify(request),
        },
      ),
    ),
  cancel: async (id: string, request: MarketEventCancelRequest) =>
    toMarketEvent(
      await apiClient<ApiMarketEvent>(
        `${MARKET_EVENTS_ENDPOINT}/${encodeURIComponent(id)}/cancel`,
        {
          method: "POST",
          body: JSON.stringify(request),
        },
      ),
    ),
  supersede: async (request: MarketEventCreateRequest) =>
    toMarketEvent(
      await apiClient<ApiMarketEvent>(`${MARKET_EVENTS_ENDPOINT}/supersede`, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    ),
};
