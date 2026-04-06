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
  - Align with the ecosystem auth/access strategy only if dashboard-authenticated access is in scope
- `ci-cd`
  - Meet frontend quality-gate expectations
- `testing`
  - Meet minimum dashboard testing expectations
- `documentation`
  - Keep docs accurate, coherent, and non-conflicting
- `security-access-control`
  - Keep dashboard access posture explicit and avoid implying protection that does not exist

## Current Phase Objective
This phase is limited to:
- verifying dashboard conformance to consumed contracts that are actually relevant now
- correcting route/client behavior where it clearly violates shared contracts
- establishing or correcting minimal frontend quality signals where required standards are clearly violated
- correcting documentation drift directly related to actual dashboard behavior

This phase is not for broad product expansion or speculative auth rollout.

## Required This Phase
- Verify each relevant consumed contract and classify it as:
  - already compliant
  - partially compliant
  - missing
  - incorrectly implemented
- Implement only confirmed dashboard-local conformance gaps
- Verify canonical route usage in API client behavior
- Verify dashboard docs accurately describe current access posture
- Fix documentation only where it directly contradicts actual dashboard behavior
- Fix CI/CD or testing only where:
  - required standards are clearly violated, and
  - the gap materially weakens confidence in this repo

## Not Required This Phase
- Dashboard authentication rollout unless explicitly in scope
- API route alias implementation
- Server-side transfer logic
- Server-side error semantics ownership
- Incident persistence model
- Broad frontend redesign unrelated to contract consumption

## Local Requirements
- Keep API client/path logic centralized and understandable
- Keep data-fetching abstractions clean
- Keep runtime config injection maintainable
- Avoid overstating backend capabilities or security guarantees
- Keep recruiter-facing docs coherent and honest

## Governance Requirements
- Comply with shared `ci-cd`, `testing`, `documentation`, and `security-access-control` standards
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
- Is dashboard access posture documented accurately and aligned with the shared security/access-control standard?
- Is there a minimal but meaningful test foundation?
- Are CI/CD checks sufficient for this phase?

## Success Criteria
- Dashboard is a clean and trustworthy contract consumer
- API client behavior matches canonical routes and semantics
- Dashboard docs accurately describe current access posture
- Minimal tests provide useful confidence
- CI/CD meets minimum required confidence for this phase