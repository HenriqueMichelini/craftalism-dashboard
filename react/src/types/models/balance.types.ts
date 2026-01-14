export type Balance = {
  uuid: string;
  amount: number;
  status?: "active" | "inactive";
};
