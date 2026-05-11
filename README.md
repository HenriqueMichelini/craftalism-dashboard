# Craftalism Dashboard

> React + TypeScript admin dashboard that provides operational visibility into the Craftalism economy: players, balances, and transactions, sourced from the Craftalism API.

---

## Overview

The dashboard is a read-oriented frontend that lets administrators inspect the state of the economy in real time. It connects to the Craftalism API over HTTP and presents player records, wallet balances, and transaction history in a consistent table-based UI.

**Key capabilities:**

- View all players with UUID, display name, and registration date.
- View all balances with player UUID and current amount.
- View all transactions with sender/receiver UUIDs, amount, and timestamp.
- Loading, empty, and error states with inline retry on every data view.
- Consistent date and currency formatting across all views.

> **Note:** "Add Player" and "Add Balance" buttons are present in the UI but are not wired to any create flow. They are placeholders for future functionality.

---

## Architecture

The application follows a feature-first structure. Each dashboard section (Players, Transactions, Balances) owns its own view component and table configuration, while cross-cutting concerns (API client, data-fetching hook, formatting utilities) live in shared modules.

### Layers

**Layout/UI layer** — `DashboardLayout`, `Navbar`, and `SideBar` compose the shell. Sidebar items are presentational and not yet route-driven.

**Feature view layer** — `PlayersView`, `TransactionsView`, and `BalancesView` each declare their own column config and pass it to the shared table system.

**Reusable table layer** — `DynamicTable` is a generic component that accepts a column config and a data array. Loading, empty, and error states are handled as separate components composed around it.

**Data layer** — `apiClient` is a thin fetch wrapper. Domain modules (`playersApi`, `transactionsApi`, `balancesApi`) expose typed methods over it.

**State layer** — `useTableData` is a single hook that centralizes async fetch, loading state, error state, and refetch behavior for all views.

---

## Tech Stack

| Category | Technology |
|---|---|
| Language | TypeScript 5 |
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Linting | ESLint 9 (React Hooks + Tailwind plugins) |
| Packaging | Docker multi-stage (Node build + Nginx runtime) |

---

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Engine 20.10+ *(for containerized deployment only)*

---

## Configuration

### Development

Vite proxies `/api` requests to the backend. Set the target with an environment variable, or let it fall back to the default.

| Variable | Default | Description |
|---|---|---|
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | Backend URL used by the Vite dev server proxy. |

### Runtime (Docker / Nginx)

`docker-entrypoint.sh` injects runtime configuration by generating `/runtime-config.js` before Nginx starts. The Nginx upstream is also templated at container startup.

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | — | API base URL visible to the browser. If set to `localhost` or `127.0.0.1`, the entrypoint rewrites it to `/api` to avoid CORS issues. |
| `VITE_API_TIMEOUT` | — | Request timeout in milliseconds. |
| `API_UPSTREAM_URL` | `http://craftalism-api:8080` | Nginx upstream target for `/api/*` reverse proxy. |

---

## Running Locally

```bash
cd react
npm install
npm run dev
```

The app is available at the URL printed by Vite (typically `http://localhost:5173`).

---

## Running with Docker

```bash
cd react
docker build -t craftalism-dashboard -f Dockerfile .
docker run --rm -p 8080:80 \
  -e API_UPSTREAM_URL=http://host.docker.internal:3000 \
  -e VITE_API_TIMEOUT=10000 \
  craftalism-dashboard
```

| Service | Port | URL |
|---|---|---|
| Dashboard | 8080 | `http://localhost:8080` |

---

## API Reference

The dashboard consumes the following Craftalism API endpoints. All requests are proxied through `/api`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/players` | List all players. |
| `GET` | `/api/players/{uuid}` | Get a single player by UUID. |
| `GET` | `/api/transactions` | List all transactions. |
| `GET` | `/api/transactions/{id}` | Get a single transaction by ID. |
| `GET` | `/api/transactions/to/{uuid}` | List incoming transactions for a player. |
| `GET` | `/api/transactions/from/{uuid}` | List outgoing transactions for a player. |
| `GET` | `/api/balances` | List all balances. |
| `GET` | `/api/balances/{uuid}` | Get a player's balance by UUID. |

> **Note:** The current UI only calls the `getAll` variants. Detail and filter methods exist in the API layer and are ready for use when views are extended.

---

## Testing

A minimal automated harness is available for dashboard data access behavior:

```bash
cd react
npm run test
```

Current coverage focuses on:

- transaction API client route contracts (`/api/transactions/{id}`, `/api/transactions/to/{uuid}`, `/api/transactions/from/{uuid}`)
- table data loading abstraction used by the dashboard hook (`loadTableData`)
- dynamic table rendering behavior
- dashboard view configuration and view selection behavior

GitHub Actions quality gates run lint, test, and build on pull requests and pushes to `main`.

---

## Project Structure

```text
.
├── AGENTS.md
├── AGENT-PROMPT.md
├── docs/
└── react/

react/
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   └── endpoints/
│   ├── components/
│   │   ├── layout/
│   │   ├── shared/
│   │   └── ui/Table/
│   ├── config/
│   │   └── runtime.ts
│   ├── hooks/
│   │   └── useTableData.ts
│   ├── layouts/
│   │   └── DashboardLayout.tsx
│   ├── pages/Dashboard/
│   │   └── views/
│   │       ├── PlayersView/
│   │       ├── TransactionsView/
│   │       └── BalancesView/
│   ├── types/
│   └── utils/
├── Dockerfile
├── docker-entrypoint.sh
├── nginx.conf
└── package.json
```

---

## For AI Agents

This repository uses the Craftalism project-template documentation structure.

Start with:

1. `AGENTS.md`
2. `docs/index.md`
3. `docs/context-policy.md`
4. `docs/workflows/index.md`

Do not scan the full repository by default.

---

## Known Limitations

- The standalone dashboard container has no built-in auth. Production deployments should front it with HTTPS and access control at the edge proxy.
- Create, update, and delete flows are not implemented; action buttons are UI placeholders only.
- Sidebar navigation items are presentational and not backed by routing.
- Test coverage is intentionally minimal and currently focused on core data-fetching behavior.

---

## Roadmap

- Add React Router and route-driven navigation for dashboard sections.
- Implement create/update/delete flows for players, balances, and transactions.
- Add query, filter, sort, and pagination support for large datasets.
- Add unit and integration tests for the API client, hooks, and table rendering.

---

## License

MIT. See [`LICENSE`](./LICENSE) for details.
