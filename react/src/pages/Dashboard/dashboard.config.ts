export const dashboardViews = [
  { id: "balances", label: "Balances" },
  { id: "transactions", label: "Transactions" },
  { id: "players", label: "Players" },
] as const;

export type DashboardView = (typeof dashboardViews)[number]["id"];
