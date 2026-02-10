# ProofDesk AI

**AI Governance & Client Proof-of-Work Platform**

Convert work activity into trusted client evidence, risk signals, and billing-ready packets. Built for agencies and consultancies.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with semantic design tokens + dark mode
- **Forms**: React Hook Form + Zod v4 validation
- **Server State**: TanStack Query v5
- **Client State**: Redux Toolkit (workflows, demo, selection)
- **Animation**: GSAP + ScrollTrigger with reduced-motion support
- **Database**: PostgreSQL + Prisma v7 ORM
- **Auth**: NextAuth.js v5 (JWT strategy)
- **Billing**: Stripe integration
- **Monitoring**: Sentry
- **Testing**: Vitest + React Testing Library
- **CI/CD**: GitHub Actions

## Quick Start

```bash
# Install dependencies
npm ci

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |

## Dual-Mode Operation

ProofDesk AI supports two operational modes controlled by `APP_MODE`:

- **`production`**: Full auth, real Stripe billing, production database
- **`demo`**: Synthetic auth, seeded data, scenario playback, reset-to-baseline

## MVP Modules

1. **Dashboard** — Organization overview with stats and activity
2. **Clients** — Client management with CRUD and archiving
3. **Projects** — Project tracking with status, progress, and team
4. **Timeline** — Canonical event timeline from multiple sources
5. **Evidence Library** — Artifact storage with provenance tracking
6. **AI Status Copilot** — AI-generated traceable status summaries
7. **Risk Monitor** — Scope creep, delivery delay, and blocker detection
8. **Approvals Center** — Approval routing with decision history
9. **Billing Packets** — Invoice-ready evidence bundles
10. **Audit Explorer** — Immutable activity log with filtering
11. **Settings** — Profile, notifications, appearance, shortcuts
12. **Demo Simulator** — Interactive scenario playback
13. **Keyboard Shortcuts** — Scope-aware shortcut system with command palette
14. **Motion Showcase** — GSAP animation demos with a11y support

## Architecture

- **Multi-tenant**: Row-level isolation via `organizationId` on all business tables
- **RBAC**: OWNER > ADMIN > MANAGER > CLIENT_VIEWER role hierarchy
- **Rate Limiting**: In-memory rate limiting on auth and mutation endpoints
- **Audit Logging**: Immutable `ActivityLog` for all critical actions
- **Accessibility**: AA+ compliance, skip links, focus management, reduced motion

## Documentation

- [Deployment Guide](docs/deployment-guide.md)
- [ADR-001: Tech Stack](docs/adr/001-tech-stack.md)
- [ADR-002: Multi-Tenancy](docs/adr/002-multi-tenancy.md)

## License

Proprietary. All rights reserved.
