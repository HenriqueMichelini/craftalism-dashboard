export const dashboardViews = [
    { id: 'overview', label: 'Overview' },
    { id: 'balances', label: 'Balances' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'users', label: 'Users' },
] as const;

export type DashboardView = typeof dashboardViews[number]['id'];