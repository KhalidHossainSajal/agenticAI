# AXLE 2.0 — Architecture

This document captures the **as-built** architecture for the current phase. It is intentionally short; the full product vision lives in `docs/AXLE-2.0.md`.

## Phase 0 scope

Phase 0 establishes only the foundation:

- `api/` exposes `GET /api/health` and `GET /api/health/db`.
- `web/` renders a health page that calls both endpoints.
- MySQL 8.4 is the system of record (no ORM, no pgvector).
- A custom migration runner applies `database/migrations/*.sql` in order, tracking state in a `schema_migrations` table.

Nothing else exists yet. Do not add tables, routes, or UI for future phases.

## High-level shape (target)

```
Browser
   │
   ▼
React (web/)  ──────► Express (api/)
                        │
                        ▼
                    MySQL 8.4
```

## Repository map

| Path                              | Purpose                                          |
|-----------------------------------|--------------------------------------------------|
| `api/src/server.ts`               | Express bootstrap, mounts routers, error handler |
| `api/src/config/env.ts`           | zod-validated environment loading                |
| `api/src/db/pool.ts`              | `mysql2/promise` connection pool                 |
| `api/src/middleware/error.ts`     | Final error → JSON envelope                      |
| `api/src/routes/health.ts`        | `/api/health`, `/api/health/db`                  |
| `database/scripts/migrate.ts`     | Migration runner (Node, no extra deps)           |
| `database/migrations/*.sql`       | Append-only schema changes                       |
| `web/src/main.tsx`                | React entry                                      |
| `web/src/App.tsx`                 | Route to `HealthPage`                            |
| `web/src/lib/api.ts`              | Typed fetch helper                               |
| `web/src/pages/HealthPage.tsx`    | Calls both endpoints, shows status               |

## Database conventions

- Identifiers: `snake_case` for tables and columns.
- Primary keys: `id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`.
- Timestamps: `created_at`, `updated_at` (both `DATETIME(3)`, default `CURRENT_TIMESTAMP(3)`).
- Charset: `utf8mb4`, collation `utf8mb4_unicode_ci`.
- Engine: `InnoDB`.
- Every tenant-scoped table will, in later phases, include `business_id BIGINT UNSIGNED NOT NULL` with an index — Phase 0 has no such tables yet.
- Migrations are append-only; never edit a file once it has been applied.

## API conventions

- All endpoints return JSON.
- Success: `{ "success": true, "data": ... }` (Phase 0's `/api/health` returns the spec's minimal `{ "status": "ok" }` shape directly — it predates the wrapper).
- Failure: `{ "success": false, "error": { "code": "...", "message": "..." } }`.
- No stack traces or secrets ever cross the API boundary.

## Why these choices

- **No ORM.** Spec §4 forbids unnecessary packages; raw `mysql2` queries are easy to audit and fast to write.
- **No Docker in Phase 0.** The host environment does not have Docker; production containerization is deferred to Phase 15.
- **Custom migration runner.** No third-party CLI; the runner is ~50 lines and applied via `npm run db:migrate`.

## What is deliberately not here yet

- Authentication, JWT, users
- Business / tenant tables
- AI providers
- Agents, knowledge, conversations
- RAG, embeddings, vector search
- Widget, voice, TTS
- API keys, billing, subscriptions
- Admin panel
- Container / VPS deployment

These land in their respective phases per `docs/AXLE-2.0.md`.
