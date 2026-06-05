# Dashboard Client Contract

## Purpose

The dashboard consumes core Craftalism API resources and owns frontend-local
request construction, validation, and presentation behavior.

## Ownership

This repository owns:

- dashboard-local form validation
- dashboard API client request construction
- loading, empty, error, and retry presentation
- dashboard-local tests

This repository consumes:

- player, balance, and transaction semantics
- API request and response schemas
- API validation and error semantics

## Player UUID Validation

- Player UUIDs entered through the dashboard must be canonical UUID strings.
- The dashboard must not require a specific UUID version.
- Duplicate player UUID detection remains case-insensitive.
- Player UUIDs remain immutable after creation.

## Out of Scope

- Player UUID generation
- Backend player persistence or validation semantics
- Database schema constraints
- Minecraft online-mode or offline-mode configuration
