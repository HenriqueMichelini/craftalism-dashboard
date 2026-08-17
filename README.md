# Craftalism Dashboard

React and TypeScript operations dashboard for inspecting and managing Craftalism players, balances, transactions, and market data.

## Features

The dashboard currently provides eight tab-based views:

- **Players** — list, create, edit, and delete players.
- **Balances** — list, create, edit, and delete player balances.
- **Transactions** — inspect transaction history and filter by player, amount, and date/time.
- **Market Categories** — list, create, edit, and delete market categories.
- **Market Items** — manage item pricing, stock, regeneration, and state controls, and trigger a market drift reset.
- **Market Trades** — inspect buy and sell history with player, item, total-price, and date/time filters.
- **Market Events** — create, edit, cancel, and supersede events using category and event-template data.
- **Market Event Templates** — list, create, edit, and delete event templates.

All data views provide loading, empty, error, and retry states. Navigation between views is held in React state; the application does not currently use URL routing. The expandable sidebar is presentational and does not change the active view.

## Tech Stack

| Category | Technology |
|---|---|
| UI | React 19.2 |
| Language | TypeScript 5.9 |
| Build tool | Vite 7.2 with SWC |
| Styling | Tailwind CSS 3.4 |
| Icons | Lucide React |
| Linting | ESLint 9 |
| Tests | Node.js test runner with compiled TypeScript/TSX fixtures |
| Container | Multi-stage Node 20 and Nginx image |

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (required by the installed Vite version)
- npm
- Docker Engine, only when building or running the container
- A reachable Craftalism API for application data

## Local Development

Install the locked dependencies and start Vite from the frontend directory:

```bash
cd react
npm ci
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`. Browser requests use `/api` by default, and the development server proxies them to `http://localhost:3000`.

To use a different development backend, set `VITE_API_PROXY_TARGET` in the command environment:

```bash
VITE_API_PROXY_TARGET=http://localhost:8080 npm run dev
```

The amount formatter and amount filters use a scale of `10000` by default. The repository-level `.env.example` contains the matching setting. Copy it into `react/` if you need a local Vite environment file:

```bash
cd react
cp ../.env.example .env
```

## Configuration

| Variable | Phase | Default | Purpose |
|---|---|---|---|
| `VITE_API_PROXY_TARGET` | Vite development server | `http://localhost:3000` | Upstream used by the `/api` development proxy. Set it in the shell that starts Vite. |
| `VITE_API_URL` | Vite build or container startup | `/api` | Browser-visible API base URL. In the container, localhost and `127.0.0.1` URLs are normalized to `/api`. |
| `VITE_API_BASE_URL` | Vite build | `/api` | Fallback alias for `VITE_API_URL`. The Docker entrypoint does not inject this variable at runtime. |
| `VITE_AMOUNT_SCALE` | Vite build | `10000` | Integer scale used to convert and format monetary amounts. |
| `VITE_API_TIMEOUT` | Vite build or container startup | `10000` | Parsed into runtime configuration. It is not currently connected to request cancellation, so changing it does not enforce a fetch timeout. |
| `API_UPSTREAM_URL` | Container startup | `http://craftalism-api:8080` | Nginx upstream used for same-origin `/api/*` requests. |

`VITE_*` values are visible in browser code and must not contain secrets. For a same-origin container deployment, leave `VITE_API_URL` unset so the browser calls `/api` and Nginx forwards requests to `API_UPSTREAM_URL`. A non-local absolute `VITE_API_URL` makes the browser call that origin directly and therefore requires the API to permit the browser origin.

## Available Commands

Run these commands from `react/`:

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check the application and create a production build in `react/dist/`. |
| `npm run build:docker` | Create the Vite production bundle used by the Docker build. |
| `npm run lint` | Lint the frontend source and tests. |
| `npm run test` | Compile the test target into `.tmp-tests/` and run the Node.js test suite. |
| `npm run preview` | Serve the production bundle locally with Vite. |

## Docker

Build the image from the `react/` context:

```bash
cd react
docker build -t craftalism-dashboard .
```

The container serves the dashboard on port 80 and includes a health check. This example exposes it on host port 8080 and proxies API requests to a backend running on host port 3000:

```bash
docker run --rm \
  --add-host=host.docker.internal:host-gateway \
  -p 8080:80 \
  -e API_UPSTREAM_URL=http://host.docker.internal:3000 \
  craftalism-dashboard
```

Open `http://localhost:8080`. When the API is another container, attach both containers to the same Docker network and set `API_UPSTREAM_URL` to the API container's network address instead.

At startup, `docker-entrypoint.sh`:

1. renders the Nginx configuration with `API_UPSTREAM_URL`;
2. writes browser-visible runtime settings to `/usr/share/nginx/html/runtime-config.js`; and
3. adds that script to `index.html` before starting Nginx.

## API Usage

The frontend API client sends JSON requests and surfaces RFC 7807-style `detail` or `title` error messages when available. It consumes the following routes.

### Read routes

| Method | Path | Use |
|---|---|---|
| `GET` | `/api/players` | List players. |
| `GET` | `/api/players/{uuid}` | Read one player; available in the client but not used by the current views. |
| `GET` | `/api/balances` | List balances. |
| `GET` | `/api/balances/{uuid}` | Read one balance; available in the client but not used by the current views. |
| `GET` | `/api/transactions` | List and filter transactions. |
| `GET` | `/api/transactions/{id}` | Read one transaction; available in the client but not used by the current views. |
| `GET` | `/api/transactions/to/{uuid}` | List incoming transactions; available in the client but not used by the current views. |
| `GET` | `/api/transactions/from/{uuid}` | List outgoing transactions; available in the client but not used by the current views. |
| `GET` | `/api/market/trades` | List and filter market trades. |

### Dashboard administration routes

| Methods | Path | Use |
|---|---|---|
| `POST` | `/api/dashboard/players` | Create a player. |
| `PATCH`, `DELETE` | `/api/dashboard/players/{uuid}` | Update or delete a player. |
| `POST` | `/api/dashboard/balances` | Create a balance. |
| `PATCH`, `DELETE` | `/api/dashboard/balances/{uuid}` | Update or delete a balance. |
| `GET`, `POST` | `/api/dashboard/market/categories` | List or create market categories. |
| `PATCH`, `DELETE` | `/api/dashboard/market/categories/{categoryId}` | Update or delete a market category. |
| `GET`, `POST` | `/api/dashboard/market/items` | List or create market items. |
| `PATCH`, `DELETE` | `/api/dashboard/market/items/{itemId}` | Update or delete a market item. |
| `POST` | `/api/dashboard/market/drift/reset` | Reset market drift. |
| `GET`, `POST` | `/api/dashboard/market/event-templates` | List or create market event templates. |
| `PUT`, `DELETE` | `/api/dashboard/market/event-templates/{templateId}` | Update or delete a market event template. |
| `GET`, `POST` | `/api/dashboard/market/events` | List or create market events. |
| `PATCH` | `/api/dashboard/market/events/{id}` | Update a market event. |
| `POST` | `/api/dashboard/market/events/{id}/cancel` | Cancel a market event. |
| `POST` | `/api/dashboard/market/events/supersede` | Supersede the active market event. |

The dashboard defines client-side route construction; the API remains the authority for route semantics, validation, permissions, and persistence.

## Access and Security

The standalone dashboard has no login flow, token acquisition, or explicit `Authorization` header handling. Protect dashboard access at the deployment or edge layer, and ensure the API path used for administration requests satisfies the backend's authentication and authorization requirements. Browser-visible runtime configuration is not a secret store.

The included Nginx configuration adds basic response headers, proxies `/api/*`, disables caching for the application shell, and caches static assets. TLS termination and deployment-wide access control are outside this repository.

## Architecture

The frontend uses feature-oriented views backed by shared UI and data-access modules:

```text
Dashboard views
  -> shared tables, filters, modal shell, and useTableData
  -> endpoint-specific API modules
  -> API client and runtime configuration
  -> Craftalism API over HTTP
```

- `DashboardPage` owns the active tab and renders the selected view.
- Feature directories under `react/src/pages/Dashboard/views/` contain their tables, forms, validation, and view-specific actions.
- `DynamicTable`, `TableFilters`, modal infrastructure, and loading/error states are reusable UI primitives.
- `useTableData` centralizes loading, error, retry, and local data-update behavior.
- API paths and request shapes are centralized under `react/src/api/`.
- The application has no database or durable browser persistence.

## Project Structure

```text
.
├── .github/workflows/       # Quality gates and container publishing
├── docs/                    # Repository workflows, contracts, and feature docs
├── react/
│   ├── src/
│   │   ├── api/             # HTTP client and endpoint modules
│   │   ├── components/      # Layout and reusable UI components
│   │   ├── config/          # Browser runtime configuration
│   │   ├── hooks/           # Shared data-loading state
│   │   ├── layouts/         # Dashboard shell
│   │   ├── pages/Dashboard/ # Dashboard tabs and feature views
│   │   ├── types/           # API and table types
│   │   └── utils/           # Date, number, and amount formatting
│   ├── tests/               # API, component, hook, layout, and view tests
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   ├── nginx.conf
│   └── package.json
├── .env.example
├── AGENTS.md
└── README.md
```

## Validation and CI

Run the same quality checks used by GitHub Actions:

```bash
cd react
npm ci
npm run lint
npm run test
npm run build
```

The quality-gate workflow runs on pull requests and pushes to `main`. Version tags matching `v*.*.*` and manual workflow dispatches run the same checks before building and publishing the Docker image to GitHub Container Registry.

## For AI Agents

Follow the repository's minimum-context entry flow:

1. Read `AGENTS.md`.
2. Read `docs/index.md`.
3. Read `docs/context-policy.md`.
4. Select a workflow through `docs/workflows/index.md`.

Do not scan the full repository by default.

## License

MIT. See [`LICENSE`](./LICENSE).
