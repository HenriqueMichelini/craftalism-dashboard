export type MarketTrade = {
  id: string;
  type: "buy" | "sell";
  playerUuid: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
};
