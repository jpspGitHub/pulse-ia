# PulseIA Monorepo

Production-grade monorepo skeleton for PulseIA using Turborepo, Next.js, NestJS, Postgres, and BullMQ.

## Prerequisites

- Node.js 20+
- pnpm
- Docker + Docker Compose

## Quick Start

```bash
pnpm install
pnpm dev
```

Docker dev environment:

```bash
pnpm dev:docker
```

## Services and Ports

- Webchat (Next.js): http://localhost:3000
- Dashboard (Next.js): http://localhost:3001
- API (NestJS): http://localhost:4000
- Worker health: http://localhost:4100/health
- Postgres: localhost:5432
- Redis: localhost:6379

## Database Migrations & Seeds

SQL migrations and seeds live in `packages/db`.

Run migrations and seeds locally:

```bash
pnpm db:migrate
pnpm db:seed
```

Docker Postgres connection string (default):

```
postgres://pulseia:pulseia@localhost:5432/pulseia
```

Dev seed credentials:

- Email: `admin@pulseia.local`
- Password: `pulseia123`

## Dev with Docker

`pnpm dev:docker` starts Postgres, Redis, API, Worker, Webchat, and Dashboard.

## Notes

- Environment variables are validated at startup using Zod.
- Auth uses bcrypt hashes stored in Postgres. See `packages/db/seeds/001_seed_dev.sql` for dev credentials.
- Google/Microsoft OIDC and Magic Link are placeholders for future implementation.
