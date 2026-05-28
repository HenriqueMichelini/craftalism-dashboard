# Feature Index

## Purpose

This directory contains feature-level documentation for `craftalism-dashboard`.

Each feature should have:

- `contract.md`
- `cards/`

Feature-local `index.md` is required only for multi-card features and optional otherwise.

## Features

| Feature | Status | Purpose |
|---|---|---|
| `dashboard-client` | active | Read-oriented frontend client for players, balances, transactions, runtime config, and dashboard UI state |
| `market-categories` | active | Manage API-owned market categories used by market item configuration and snapshots. |
| `market-events` | planned | Display API-owned market event instances through dashboard admin read routes. |
| `market-items` | planned | Manage market item configuration through API-owned dashboard admin CRUD routes. |
| `market-trades` | planned | Display buy and sell market trade operations consumed from the Craftalism API. |
| `table-filters` | planned | Add API-backed filter controls for dashboard tables, starting with Transactions and Market Trades. |

## Feature Documentation Rules

Feature documentation must separate stable rules from execution tasks.

Use:

- `contract.md` for stable feature rules
- `cards/` for implementation tasks
- feature-local `index.md` for multi-card execution maps
- optional expansion documents only when routed by `docs/index.md`, a feature contract, or a selected card

Card dependency frontmatter is the canonical source for execution dependencies. Feature-local indexes summarize execution order but must not become the dependency authority.

## Agent Rule

Do not read every feature folder.

Select the relevant feature from this index, then read only its routed documents.
