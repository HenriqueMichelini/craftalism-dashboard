# AGENTS.md

## Purpose

This repository is prepared for AI-agent-assisted development of the Craftalism dashboard.

The dashboard owns frontend behavior for reading, displaying, and interacting with Craftalism system data. It consumes API, auth, testing, CI/CD, documentation, and security standards from the Craftalism governance repository.

Agents must optimize for minimum sufficient context: enough information to avoid guessing, but not so much that the context window becomes polluted.

## Mandatory Entry Flow

Before working on any task, agents must:

1. Read this file.
2. Read `docs/index.md`.
3. Read `docs/context-policy.md`.
4. Use `docs/workflows/index.md` to select the appropriate workflow.
5. Read only the routed documents required for the task.
6. Inspect only source files directly related to the task.

Agents must not scan the entire repository by default.

## Ownership Requirement

Before acting, state whether this repository owns or consumes the behavior.

Dashboard-owned behavior includes:

- UI/API client correctness
- API route path construction in the frontend client
- loading, empty, error, and retry states
- runtime configuration consumption by the frontend container
- dashboard-specific documentation and tests

Consumed behavior includes:

- API route semantics
- backend error semantics
- auth issuer behavior
- ecosystem-wide CI/CD, testing, documentation, and security/access-control standards

## Boundary Rule

If an issue originates outside this repository:

- stop at the boundary
- identify the owning repository
- suggest what should be changed there

Do not implement cross-repo changes locally and do not redefine shared contracts inside this repository.

## Context Rule

Do not maximize context.

Select the smallest context set that answers:

- What is the task objective?
- What rules constrain the task?
- What behavior must be preserved?
- What files are likely affected?
- How should the result be validated?

If any of these are unknown, retrieve the missing context before changing files.

## Source of Truth Priority

When information conflicts, use this priority:

1. Craftalism shared contracts in `../craftalism/docs/contracts/`
2. Craftalism shared standards in `../craftalism/docs/standards/`
3. Current source code and tests
4. Selected implementation card, when one exists
5. Repository feature contract
6. `docs/architecture/boundaries.md`
7. `docs/conventions.md`
8. `README.md`

If the conflict affects behavior, public routes, permissions, security, or cross-repo assumptions, stop and report it before implementation.

## Forbidden Default Behavior

Agents must not:

- read all files under `docs/`
- read all feature folders
- read the entire source tree
- modify unrelated files
- update broad documentation unless required
- introduce architectural changes while implementing a narrow card
- treat optional notes, ADRs, wiki pages, or historical documents as authoritative by default

## Hard Stop Conditions

Agents must stop before implementation if:

- expected files or source areas are unknown
- validation commands are missing and no fallback is defined
- source code or tests contradict the selected card, feature contract, or shared contract
- the task affects public APIs, schemas, persistence, permissions, security, or external behavior without explicit scope
- the implementation requires changing another repository
- the requested change would redefine a Craftalism shared contract locally

For card-based implementation, also stop if no selected card exists or the selected card is missing objective, acceptance criteria, expected files, validation commands, or out-of-scope items.

## Scope Declaration

Before implementation, agents must declare:

- selected workflow
- selected task or card
- ownership classification
- selected context files
- expected behavior
- files likely to change
- validation commands
- out-of-scope items

## Completion Report

After implementation, agents must report:

- files changed
- behavior changed
- validation results
- unresolved risks
- documentation updated, if applicable

## Commit Requirement

After implementation, suggest commit message(s) that:

- reflect only the implemented change
- are specific and scoped
- do not mix unrelated work
