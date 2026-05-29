# Market Drift Admin Reset Handoff

## Purpose

`craftalism-api` now exposes backend support needed for a future dashboard
admin control that can reset persisted market drift after bad tuning or an
operational drift-state incident.

This is a dashboard handoff only. Authoritative drift behavior, reset
semantics, pricing recomputation, and authorization remain owned by
`craftalism-api`.

## API-Side Changes Implemented

- Ordinary per-item drift evaluation was retuned so a live-like six hourly
  ticks no longer drives most balanced catalog items to the exact `-6%` or
  `+6%` drift bounds.
- Drift remains bounded by the existing absolute `10000 +/- 600` basis-point
  cap.
- Drift still evaluates for balanced market items where `netPosition == 0`.
- Pinned drift moves back inside bounds on later ordinary evaluations.
- Snapshot estimates and `variationPercent` still reflect the drift multiplier
  after recomputation.
- Named event pricing, event lifecycle, quote pricing context, and pressure
  regeneration behavior were not changed.

## New Admin Reset Route

The backend now exposes:

```text
POST /api/dashboard/market/drift/reset
```

Authorization:

```text
SCOPE_market:admin
```

This is the same market admin authority used for dashboard market event admin
operations. Public `/api/market/**` routes were not broadened.

Expected response shape:

```ts
type MarketDriftResetResponse = {
  resetItemCount: number;
  driftMultiplierBasisPoints: number; // always 10000 after reset
  driftEvaluatedAt: string;
};
```

## Reset Semantics

When called by an authorized market admin, the reset operation:

- loads all persisted market items
- sets each `driftMultiplierBasisPoints` to neutral `10000`
- increments each item's `driftRevision`
- sets each item's `driftEvaluatedAt` to the reset time
- recomputes `buyUnitEstimate`, `sellUnitEstimate`, and `variationPercent`
- causes subsequent public snapshots to reflect neutral drift through existing
  price and `variationPercent` fields

The operation does not:

- change named event lifecycle, scheduler, template, or pricing behavior
- change pressure-ladder price derivation
- expose reset behavior through public market routes
- perform automatic resets
- support per-item or per-category reset selection

## Dashboard Follow-Up Notes

For a future table-view admin panel, the dashboard can add a guarded action
near the market events or market items admin area that calls the reset route
and then refreshes the affected table/snapshot data.

Recommended UI behavior:

- require an explicit confirmation before submitting
- show loading and error states using existing dashboard table/action patterns
- on success, show the count of reset items and refresh market rows
- treat `401`/`403` as the existing admin-auth boundary, not as a public API
  failure
- do not calculate drift locally or try to expose exact drift history

## Backend Validation Evidence

The API-side implementation passed:

```text
rtk ./gradlew test --tests io.github.HenriqueMichelini.craftalism.api.service.MarketReadServiceTest --tests io.github.HenriqueMichelini.craftalism.api.service.MarketTradePlannerTest --tests io.github.HenriqueMichelini.craftalism.api.service.MarketSnapshotProjectorTest
rtk ./gradlew test --tests io.github.HenriqueMichelini.craftalism.api.controller.DashboardMarketEventAdminSecurityTest --tests io.github.HenriqueMichelini.craftalism.api.controller.DashboardMarketEventAdminApiIntegrationTest --tests io.github.HenriqueMichelini.craftalism.api.service.MarketReadServiceTest --tests io.github.HenriqueMichelini.craftalism.api.controller.MarketContractIntegrationTest
rtk ./gradlew check
```
