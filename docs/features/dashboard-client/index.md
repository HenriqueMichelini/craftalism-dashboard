# Dashboard Client Execution Index

## Purpose

This file summarizes execution order for multi-card dashboard client work. Card frontmatter remains the canonical dependency source.

## Market Snapshot Table

| Card | Status | Dependency | Summary |
|---|---|---|---|
| `CARD-001` | planned | none | Document read-only market snapshot consumption in the dashboard client contract. |
| `CARD-002` | planned | `CARD-001` | Add the typed market snapshot API endpoint and read-only Market dashboard table. |

## Dependency Graph

```text
CARD-001 -> CARD-002
```
