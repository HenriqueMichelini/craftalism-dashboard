# Repo Requirement Pack: craftalism-dashboard

## Repo Role
`craftalism-dashboard` is a read-oriented frontend client for the ecosystem. It consumes canonical API behavior and presents operational data through a UI. It is responsible for route/client correctness, frontend hygiene, minimal but meaningful testing, and coherent documentation.

## Owned Contracts
- No core backend contracts
- Own dashboard-local behavior for:
  - UI/API client correctness
  - route usage consistency
  - loading/error handling
  - frontend testing discipline
  - dashboard-specific documentation coherence

## Consumed Contracts
- `transaction-routes`
  - Use the canonical transaction detail route contract
- `error-semantics`
  - Reflect API failures appropriately where client behavior depends on them
- `auth-issuer`
  - Align with the ecosystem auth/access strategy if dashboard auth is introduced
- `ci-cd`
  - Meet frontend quality-gate expectations
- `testing`
  - Meet minimum dashboard testing expectations
- `documentation`
  - Keep docs accurate, coherent, and non-conflicting

## Current Priority Areas
- Verify all API client paths use canonical routes
- Verify dashboard behavior matches current backend reality
- Establish or improve a minimal automated test harness
- Clean up scaffold or misleading docs
- Improve CI/CD quality gates if missing or weak
- Keep frontend runtime config behavior clear and deployment-friendly

## Local Requirements
- Keep API client/path logic centralized and understandable
- Keep data-fetching abstractions clean
- Keep runtime config injection maintainable
- Avoid overstating backend capabilities or security guarantees
- Keep recruiter-facing docs coherent and honest

## Governance Requirements
- Comply with shared `ci-cd`, `testing`, and `documentation` standards
- Treat backend contracts as authoritative
- Do not redefine backend ownership locally

## Out of Scope
- API route alias implementation
- Server-side transfer atomicity
- Server-side error semantics ownership
- Incident persistence model
- Auth-server token issuance internals
- Deployment ownership beyond dashboard-local runtime consumption

## Audit Questions
- Does the dashboard use canonical API routes correctly?
- Are client assumptions aligned with real backend behavior?
- Is there a minimal but meaningful test foundation?
- Are docs coherent and free from scaffold drift?
- Are CI/CD checks real enough for a frontend consumer repo?

## Success Criteria
- Dashboard is a clean and trustworthy contract consumer
- API client behavior matches canonical routes and semantics
- Minimal tests provide useful confidence
- Docs are coherent and recruiter-friendly
- CI/CD provides meaningful branch-level quality signals
