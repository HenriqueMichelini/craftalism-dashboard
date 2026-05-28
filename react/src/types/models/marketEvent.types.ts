export type MarketEventSource = "SCHEDULER" | "ADMIN" | "SYSTEM";

export type MarketEventRarity = "MEDIUM" | "RARE" | "EXTRA_RARE";

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
  rarity: MarketEventRarity;
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
