export type Player = {
  uuid: string;
  name: string;
  created_at: string;
  status?: "active" | "inactive";
};
