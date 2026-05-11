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
