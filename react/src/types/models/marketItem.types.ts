export type MarketItem = {
  itemId: string;
  categoryId: string;
  categoryDisplayName: string;
  displayName: string;
  iconKey: string;
  buyUnitEstimate: number;
  sellUnitEstimate: number;
  currency: string;
  currentStock: number;
  variationPercent: number;
  blocked: boolean;
  operating: boolean;
  lastUpdatedAt: string;
  marketMomentum: number;
  baseUnitPrice: number;
  minUnitPrice: number;
  maxUnitPrice: number;
  segmentSize: number;
  priceSensitivity: number;
  sellPricePercentage: number;
  baseRegenQuantity: number;
  regenIntervalSeconds: number;
  netPosition: number;
  minNetPosition: number | null;
  maxNetPosition: number | null;
};

export type MarketItemCreateRequest = {
  itemId: string;
  categoryId: string;
  categoryDisplayName: string;
  displayName: string;
  iconKey: string;
  currency: string;
  blocked: boolean;
  operating: boolean;
  baseUnitPrice: number;
  minUnitPrice: number;
  maxUnitPrice: number;
  segmentSize: number;
  priceSensitivity: number;
  sellPricePercentage: number;
  baseRegenQuantity: number;
  regenIntervalSeconds: number;
  netPosition: number;
  minNetPosition: number | null;
  maxNetPosition: number | null;
};

export type MarketItemUpdateRequest = Omit<
  MarketItemCreateRequest,
  "itemId" | "categoryId" | "displayName"
>;
