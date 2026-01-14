export type Transaction = {
  id: string;
  fromPlayerUuid: string;
  amount: number;
  toPlayerUuid: string;
  createdAt: string;
  status?: "active" | "inactive";
};
