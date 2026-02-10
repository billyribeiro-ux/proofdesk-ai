# ADR-001: Technology Stack Selection

## Status
Accepted

## Context
ProofDesk AI requires a modern, production-ready stack that supports multi-tenant SaaS with dual-mode operation (production + demo simulator), strong typing, accessibility, and rapid iteration.

## Decision
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with semantic design tokens
- **Forms**: React Hook Form + Zod validation
- **Server State**: TanStack Query v5
- **Client State**: Redux Toolkit (complex workflows only)
- **Animation**: GSAP + ScrollTrigger with reduced-motion support
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5 with JWT strategy
- **Billing**: Stripe (production), mock (demo)
- **Monitoring**: Sentry
- **Testing**: Vitest + React Testing Library + Playwright
- **CI/CD**: GitHub Actions

## Consequences
- Strong type safety across the entire stack
- Server components for performance, client components for interactivity
- Prisma provides type-safe database access with migration support
- Tailwind v4 semantic tokens ensure design consistency and dark mode parity
- GSAP provides performant animations with accessibility fallbacks
