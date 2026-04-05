# Repo Contract Map: craftalism-dashboard

## Repository Role
`craftalism-dashboard` is a client-side read-oriented dashboard for the ecosystem. It consumes canonical API behavior and presents operational data through a frontend UI. It is responsible for client correctness, route usage, lightweight testing, and coherent frontend documentation.

## Owned Contracts
- No core backend contracts
- Owns dashboard-local behavior for:
  - UI/API client correctness
  - route usage consistency
  - client-side loading/error behavior
  - frontend test discipline
  - dashboard-specific documentation coherence

## Consumed Contracts
- `transaction-routes`
  - Must use the canonical transaction detail route contract
- `error-semantics`
  - Must reflect API failures appropriately where client behavior depends on them
- `auth-issuer`
  - Must align with the ecosystem auth/access strategy if dashboard auth is introduced
- `ci-cd`
  - Must comply with frontend quality gates
- `testing`
  - Must meet minimum dashboard testing expectations
- `documentation`
  - Must keep docs accurate, coherent, and non-conflicting

## Local-Only Responsibilities
- API client path construction
- Runtime configuration injection
- Table/data view behavior
- Hook/client data-fetching quality
- Frontend docs cleanup and recruiter-facing coherence

## Out of Scope
- API route ownership or aliasing
- Server-side transfer logic
- Server-side error semantics ownership
- Incident persistence model
- Auth-server token issuance internals
- Deployment orchestration ownership

## Compliance Questions
- Does the dashboard consume canonical API routes correctly?
- Are client-side assumptions aligned with real backend behavior?
- Is there a minimal but meaningful automated test foundation?
- Are docs coherent and free from scaffold drift?
- Are CI/CD checks real enough for a frontend consumer repo?

## Success Signal
This repo is compliant when it is a clean and trustworthy API consumer with accurate routes, coherent docs, and enough test/CI discipline to inspire confidence.
