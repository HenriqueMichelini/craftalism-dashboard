import { apiClient } from "../client.js";
import type {
  ApiMarketEvent,
  MarketEvent,
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
};
