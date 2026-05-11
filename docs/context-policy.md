# Context Policy

## Purpose

This repository uses minimum sufficient context.

Agents must avoid both:

- context starvation: acting without enough constraints
- context flooding: reading broad unrelated material

## Core Principle

Use the smallest context set that contains enough concrete constraints to complete the task safely.

## Context Layers

| Layer | File or Directory | Purpose |
|---|---|---|
| 0 | `AGENTS.md` | Agent behavior contract |
| 1 | `docs/index.md` | Documentation router |
| 2 | `docs/workflows/` | Task execution process |
| 3 | `docs/repo-contract-map.md` | Dashboard ownership and consumed contracts |
| 4 | `docs/repo-requirement-pack.md` | Dashboard phase requirements |
| 5 | `docs/conventions.md` | Stable project-wide rules |
| 6 | `docs/architecture/` | Dashboard architecture and boundaries |
| 7 | `docs/features/<feature>/contract.md` | Feature-specific rules |
| 8 | `docs/features/<feature>/index.md` | Optional execution map for multi-card features |
| 9 | `docs/features/<feature>/cards/` | Task-specific execution units |
| 10 | Source and tests | Concrete implementation evidence |

## Selection Rule

For every task, select context that answers:

1. What is the objective?
2. What domain or feature rules apply?
3. What project-wide constraints apply?
4. What files are likely affected?
5. What behavior must be preserved?
6. How will the result be validated?

## Escalation Rule

Read more context only when:

- the current context is insufficient
- the selected workflow or card references another document
- the feature contract does not answer a required question
- source code contradicts documentation
- validation fails
- the change affects architecture, security, public API usage, permissions, or cross-repo behavior

## De-escalation Rule

Do not continue reading once the current context is sufficient to act safely.

Avoid reading:

- unrelated feature folders
- entire documentation directories
- entire source trees
- historical notes
- wiki pages unless explicitly routed

## Abstraction vs Context

Abstraction explains what matters.

Context proves what is true.

Agents should start from routing, contracts, and requirements, then pull concrete source evidence only where necessary.

## Conflict Rule

If two sources conflict, use this priority:

1. Craftalism shared contracts in `../../craftalism/docs/contracts/`
2. Craftalism shared standards in `../../craftalism/docs/standards/`
3. Current source code and tests
4. Selected implementation card
5. Repository feature contract
6. Architecture boundaries
7. Project conventions
8. README
9. Optional notes, wiki pages, and historical documents

If the conflict changes expected behavior, route usage, permissions, security posture, or cross-repo assumptions, report it before modifying files.

## Hard Stop Conditions

Agents must stop before implementation if:

- expected files or source areas are unknown
- validation commands are missing and no fallback is defined
- source code or tests contradict the selected card, feature contract, or shared contract
- the task affects public APIs, schemas, persistence, permissions, security, or external behavior without explicit scope
- the implementation requires touching another repository
- a selected card path does not exist

For card-based implementation, agents must also stop when the selected card has no objective, acceptance criteria, expected files, validation commands, or out-of-scope items.

If the selected card path does not exist, agents may report nearby candidate cards, but must not select, re-route, implement, or reverify any candidate automatically.

## Documentation Drift Rule

One fact must have one authoritative home.

- Project overview belongs in `README.md`.
- Routing rules belong in `docs/index.md`.
- Context selection rules belong in `docs/context-policy.md`.
- Dashboard ownership belongs in `docs/repo-contract-map.md`.
- Dashboard phase requirements belong in `docs/repo-requirement-pack.md`.
- Project-wide rules belong in `docs/conventions.md`.
- Architecture boundaries belong in `docs/architecture/boundaries.md`.
- Feature behavior belongs in `docs/features/<feature>/contract.md`.
- Multi-card execution order belongs in card frontmatter and optional feature-local `index.md`.
- Task-specific execution belongs in the selected card.
- Historical or exploratory notes are optional and non-authoritative.
