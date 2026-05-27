export type MarketCategory = {
  categoryId: string;
  displayName: string;
  iconKey: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type MarketCategoryCreateRequest = {
  categoryId: string;
  displayName: string;
  iconKey: string;
  displayOrder: number;
};

export type MarketCategoryUpdateRequest = Omit<
  MarketCategoryCreateRequest,
  "categoryId"
>;
