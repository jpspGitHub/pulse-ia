# Database Package

This package contains SQL migrations and seeds for PulseIA.

## Structure

- `migrations/` - Ordered SQL migrations
- `seeds/` - Dev seed data

## Running Migrations and Seeds

From the repo root:

```bash
pnpm db:migrate
pnpm db:seed
```

The scripts read `DATABASE_URL` from your environment.

Default Docker dev connection string:

```
postgres://pulseia:pulseia@localhost:5432/pulseia
```
