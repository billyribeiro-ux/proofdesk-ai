# ADR-002: Multi-Tenancy Strategy

## Status
Accepted

## Context
ProofDesk AI serves multiple organizations. Each organization's data must be strictly isolated.

## Decision
- **Shared database, row-level isolation**: All business tables include `organizationId` foreign key
- **Prisma indexes**: Composite indexes on `(organizationId, ...)` for all query patterns
- **Server-side enforcement**: `scopeWhere(orgId)` helper ensures every query is scoped
- **Middleware**: Session JWT carries `orgId` and `orgRole`
- **API layer**: `requireSession()` extracts and validates org context before any data access
- **Audit**: All mutations logged with `organizationId` for compliance

## Consequences
- No cross-tenant data leakage possible at the query level
- Single database simplifies operations
- Composite indexes ensure query performance at scale
- Every API route must call `requireSession()` — enforced by code review and tests
