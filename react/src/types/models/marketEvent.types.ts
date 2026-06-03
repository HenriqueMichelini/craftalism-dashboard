export type MarketEventSource = "SCHEDULER" | "ADMIN" | "SYSTEM";

export type MarketEventScope =
  | "ITEM"
  | "ITEM_SET"
  | "CATEGORY"
  | "MARKET_WIDE";

export type MarketEventStatus =
  | "SCHEDULED"
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELLED"
  | "SUPERSEDED";

export type MarketEventEndReason = "EXPIRED" | "CANCELLED" | "SUPERSEDED";

export type MarketEvent = {
  id: string;
  templateId: string;
  source: MarketEventSource;
  scope: MarketEventScope;
  selectedCategoryId: string | null;
  selectedItemIds: string | null;
  effectBasisPoints: number;
  effectVersion: number;
  blocking: boolean;
  startedAt: string;
  endsAt: string;
  status: MarketEventStatus;
  endReason: MarketEventEndReason | null;
  actor: string | null;
  auditMetadata: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiMarketEvent = Omit<MarketEvent, "id"> & {
  id: number | string;
};

export type MarketEventCreateRequest = {
  templateId: string;
  scope: MarketEventScope;
  selectedCategoryId?: string | null;
  selectedItemIds?: string | null;
  effectBasisPoints?: number | null;
  blocking?: boolean | null;
  durationSeconds?: number | null;
  reason?: string | null;
};

export type MarketEventUpdateRequest = {
  effectBasisPoints?: number | null;
  blocking?: boolean | null;
  durationSeconds?: number | null;
  endsAt?: string | null;
  reason?: string | null;
};

export type MarketEventCancelRequest = {
  reason?: string | null;
};
