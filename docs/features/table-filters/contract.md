# Table Filters Contract

## Purpose

The dashboard provides admin-facing filters for selected resource tables so admins can narrow records by relevant fields before reviewing table results.

## Ownership

This repository owns:

- dashboard-local filter controls and filter state behavior
- dashboard-local API client request construction after shared query contracts are confirmed
- loading, error, retry, empty, and filtered-empty table presentation
- dashboard-local tests for filter UI behavior and request construction

This repository consumes:

- API route ownership
- filter query parameter names and encoding
- backend filtering, pagination, ordering, and validation semantics
- backend error semantics for invalid filter requests

## First Slice

The first implementation slice covers:

- `Transactions`
- `Market Trades`

`Players` and `Balances` filters are deferred unless shared backend contracts define filter semantics for those tables.

## API-Backed Filtering Requirement

Pageable tables must use API-backed filtering. Filtering only the currently loaded page is not acceptable because it can hide matching records that exist on other pages.

The dashboard must not invent filter query semantics locally. Dashboard implementation is blocked until the owning API/shared contracts define filter behavior for:

- `/api/transactions`
- `/api/market/trades`

## Filter Behavior

- Filters use explicit `Apply` and `Reset` controls.
- Field edits update draft state and must not trigger API requests until `Apply` is selected.
- `Reset` clears active criteria and returns the table to the unfiltered request.
- Text filters support `contains` by default and `exact` as an option.
- Filtered empty state says `No records match the selected filters.`
- Existing unfiltered empty states remain unchanged.

## Transactions Filters

The first slice supports:

- `fromPlayerUuid` text match
- `toPlayerUuid` text match
- shared or per-field match mode for text filters: `contains` or `exact`
- `minAmount`
- `maxAmount`
- `createdFrom`
- `createdTo`

## Market Trades Filters

The first slice supports:

- `type`: `buy`, `sell`, or all
- `playerUuid` text match
- `itemId` text match
- shared or per-field match mode for text filters: `contains` or `exact`
- `minTotalPrice`
- `maxTotalPrice`
- `createdFrom`
- `createdTo`

## Out of Scope

- Backend filter implementation in this repository
- Defining API query parameter names locally
- Filtering only the current page
- Players and Balances filters in the first slice
- Sorting
- Detail pages
- Create, update, or delete flows
- Dashboard authentication rollout
- Browser storage or durable persistence
