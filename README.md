# Craftalism Dashboard

A React + TypeScript admin dashboard for viewing **players**, **transactions**, and **balances** from the Craftalism backend API.

This project currently focuses on **read-oriented operational visibility** (listing and inspecting existing data) with a reusable table system and environment-aware API configuration for local and containerized deployments.

---

## What this project does

The dashboard provides three primary data views:

- **Players**: list player UUID, name, and creation date.
- **Transactions**: list transaction ID, sender/receiver UUIDs, amount, and creation date.
- **Balances**: list player UUID and balance amount.

Each view includes:

- loading, empty, and error states,
- a retry action on failed requests,
- consistent formatting for dates and currency.

> Note: "Add Player" / "Add Balance" buttons are currently UI placeholders and do not trigger create flows.

---

## Tech stack

### Frontend
- **React 19**
- **TypeScript 5**
- **Vite 7**
- **Tailwind CSS 3**
- **Lucide React** icons

### Tooling
- **ESLint 9** with React Hooks + Tailwind plugins
- **TypeScript strict mode**

### Deployment/runtime
- **Docker** multi-stage build (Node build stage + Nginx runtime)
- Runtime environment injection via `docker-entrypoint.sh`
- Nginx reverse proxy for `/api/*` requests

---

## Architecture overview

This is a **frontend-only** project organized with a feature-first structure for dashboard views.

### High-level layers

1. **Layout/UI layer**
   - `DashboardLayout`, `Navbar`, `SideBar`, and shared headers.
2. **Feature view layer**
   - `PlayersView`, `TransactionsView`, `BalancesView`.
3. **Reusable table layer**
   - Generic `DynamicTable` + state components + per-view table configs.
4. **Data layer**
   - `apiClient` + domain endpoint modules (`playersApi`, `transactionsApi`, `balancesApi`).
5. **State/data-fetching hook**
   - `useTableData` centralizes async fetch + loading/error/refetch behavior.

### Pattern notes

- The UI is split by feature (`views/*`) while cross-cutting concerns live in reusable modules (`components/ui/Table`, `api`, `hooks`, `utils`, `types`).
- API endpoint wrappers are thin and typed.
- Formatting logic (date/currency) is centralized in utilities.

---

## Project structure

```txt
.
├── README.md
└── react/
    ├── src/
    │   ├── api/
    │   │   ├── client.ts
    │   │   └── endpoints/
    │   ├── components/
    │   │   ├── layout/
    │   │   ├── shared/
    │   │   └── ui/Table/
    │   ├── config/runtime.ts
    │   ├── hooks/useTableData.ts
    │   ├── layouts/DashboardLayout.tsx
    │   ├── pages/Dashboard/
    │   │   └── views/
    │   │       ├── PlayersView/
    │   │       ├── TransactionsView/
    │   │       └── BalancesView/
    │   ├── types/
    │   └── utils/
    ├── dockerfile
    ├── docker-entrypoint.sh
    ├── nginx.conf
    └── package.json
```

---

## API integration

The frontend expects backend endpoints under `/api` and currently consumes:

- `GET /api/players`
- `GET /api/players/:uuid`
- `GET /api/transactions`
- `GET /api/transactions/:id`
- `GET /api/transactions/to/:uuid`
- `GET /api/transactions/from/:uuid`
- `GET /api/balances`
- `GET /api/balances/:uuid`

The current UI renders list views (`getAll`) only; detail/filter methods exist in the API layer for extension.

---

## Configuration

### Development (Vite)

Vite dev server proxies `/api` to:

- `VITE_API_PROXY_TARGET` (if set), otherwise
- `http://localhost:3000`

### Runtime config (Docker/Nginx)

`docker-entrypoint.sh` generates `/runtime-config.js` with:

- `VITE_API_URL`
- `VITE_API_TIMEOUT`

And templates Nginx upstream with:

- `API_UPSTREAM_URL` (default: `http://craftalism-api:8080`)

If `VITE_API_URL` points to localhost/127.0.0.1, the entrypoint rewrites it to `/api` to avoid browser CORS issues.

---

## Run locally

### Prerequisites

- Node.js 20+
- npm 10+

### Steps

```bash
cd react
npm install
npm run dev
```

App will be available at the URL printed by Vite (typically `http://localhost:5173`).

---

## Build and preview

```bash
cd react
npm run build
npm run preview
```

---

## Run with Docker

From the `react/` directory:

```bash
docker build -t craftalism-dashboard -f dockerfile .
docker run --rm -p 8080:80 \
  -e API_UPSTREAM_URL=http://host.docker.internal:8080 \
  -e VITE_API_TIMEOUT=10000 \
  craftalism-dashboard
```

Then open `http://localhost:8080`.

---

## Current limitations / known gaps

- No authentication or authorization flow.
- No create/update/delete UI behavior wired to API.
- Sidebar items are presentational and not route-driven.
- No automated test suite is currently configured.
- Root-level `README.md` is the project guide; `react/README.md` is still the default Vite template and not authoritative for this codebase.

---

## Suggested next improvements

- Add React Router and route-level navigation for dashboard sections.
- Implement create/update/delete flows for each entity.
- Add query/filter/sort/pagination support for large datasets.
- Add unit/integration tests for API client, hooks, and table rendering.
- Add CI checks (lint, typecheck, build, tests).

