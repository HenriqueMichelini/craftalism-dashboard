export type Player = {
  uuid: string;
  name: string;
  createdAt: string;
  status?: "active" | "inactive";
};
