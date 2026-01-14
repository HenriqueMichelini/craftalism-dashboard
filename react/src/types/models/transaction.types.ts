export type Transaction = {
  id: string;
  from_player_uuid: string;
  amount: number;
  to_player_uuid: string;
  created_at: string;
  status?: "active" | "inactive";
};
