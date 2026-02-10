# ProofDesk AI — Deployment Guide

## Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Stripe account (production mode)
- Sentry project (optional)

## Environment Variables
Copy `.env.example` to `.env` and fill in all values:
```bash
cp .env.example .env
```

### Required Variables
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random 32+ char secret for JWT signing |
| `NEXTAUTH_URL` | Full URL of your deployment |
| `APP_MODE` | `production` or `demo` |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

## Setup Steps

### 1. Install dependencies
```bash
npm ci
```

### 2. Generate Prisma client
```bash
npx prisma generate
```

### 3. Run database migrations
```bash
npx prisma migrate deploy
```

### 4. Seed demo data (demo mode only)
```bash
npx tsx prisma/seed.ts
```

### 5. Build
```bash
npm run build
```

### 6. Start
```bash
npm start
```

## Demo Mode
Set `APP_MODE=demo` to enable:
- Synthetic auth (no real credentials needed)
- Seeded demo data
- Scenario playback in Demo Simulator
- Reset-to-baseline functionality

## Production Checklist
- [ ] `APP_MODE=production`
- [ ] `NEXTAUTH_SECRET` is a strong random value
- [ ] `DATABASE_URL` points to production PostgreSQL
- [ ] Stripe keys are production keys
- [ ] Sentry DSN configured
- [ ] HTTPS enforced
- [ ] Rate limiting tuned for expected traffic
- [ ] Database backups configured
- [ ] Monitoring alerts configured

## Health Check
```
GET /api/health
```
Returns `{ status: "ok", timestamp, version, mode }`.
