# Craftalism Dashboard Portfolio Backlog

Date: 2026-04-10

## Purpose

This backlog evolves `craftalism-dashboard` from a functional MVP UI into a
stronger operator-facing portfolio artifact.

Source:

- [portfolio-evolution-roadmap.md](/home/henriquemichelini/IdeaProjects/craftalism/docs/portfolio-evolution-roadmap.md)
- [repo-requirement-pack.md](/home/henriquemichelini/IdeaProjects/craftalism-dashboard/docs/repo-requirement-pack.md)

## Now

### High priority

- Expand tests for loading, empty, error, and retry states across the main data
  views.
- Add route-aware navigation so the UI behaves like a real application rather
  than a mostly presentational shell.
- Add contract checks around canonical API paths and expected payload shape.
- Clarify docs about current access posture:
  dashboard edge protection versus intentionally public API reads.

### Medium priority

- Add runtime-config validation so bad environment wiring fails clearly.
- Improve table-state polish with better empty-state and error-state UX.

## Next

### High priority

- Add search, filters, pagination, and detail views for players, balances, and
  transactions.
- Improve information hierarchy and visual consistency so the dashboard looks
  intentional and review-ready.
- Add transaction drill-down and cross-linking between related entities.

### Medium priority

- Add user-facing refresh affordances and clearer loading behavior.
- Add screenshot-ready seeded demo flow or documented sample-data setup.

## Later

- Add carefully scoped admin actions only when backed by explicit API ownership
  and security decisions.
- Add richer dashboard telemetry if it improves operator value without inflating
  complexity.

## Done When

- The dashboard feels like a real operator console, not only a data table demo.
- Frontend correctness is backed by useful tests.
- The UI materially strengthens the project’s portfolio value.
