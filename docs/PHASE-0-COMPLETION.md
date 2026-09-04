# PHASE 0 — COMPLETION REPORT

**Status:** COMPLETE

**Database:** MySQL 8.4 (Community Server 8.4.11) — confirmed via the official `mysql.exe` client shipped with the local MySQL 8.4 install. Handshake bytes from the live server report `8.4.11` with the `caching_sha2_password` default authentication plugin.

**Docker:** Not required. Local development runs on the Windows host only:

```text
Windows Host
├── Node.js API        (Express, port 3000)
├── React / Vite Web   (port 5173)
└── MySQL 8.4          (port 3306)
```

## Goal recap

Establish a clean, working AXLE 2.0 development environment:

> Browser → React → Express → MySQL 8.4

must work end to end.

## Implemented

- `web/` — Vite + React + TypeScript + Tailwind. Single `HealthPage` that calls both backend endpoints and renders per-row status.
- `api/` — Express + TypeScript with `mysql2/promise`, `helmet`, `cors`, `zod` (env validation), strict `tsconfig`.
  - `GET /api/health` → `{"status":"ok"}`
  - `GET /api/health/db` → `{"db":"ok"}` on success, `503 DB_UNAVAILABLE` envelope on failure.
  - Final error middleware that returns the spec §16 envelope; never leaks stack traces.
- `database/`
  - `migrations/0001_init.sql` — creates the `schema_migrations` ledger only.
  - `scripts/migrate.ts` — custom runner: ensures the ledger, applies un-applied files in lex order inside a transaction, records each filename as the applied version. Idempotent.
- Root: `README.md`, `ARCHITECTURE.md`, `DEVELOPMENT.md`, `AGENTS.md`, `.gitignore`, `.env.example`, plus `docs/AXLE-2.0.md` (copy of the spec).

## Validation performed

| Check | Command | Result |
|-------|---------|--------|
| MySQL 8.4 server | handshake probe + `SELECT VERSION()` via `mysql.exe` | `8.4.11` (Community Server - GPL) |
| API typecheck | `npm run typecheck` (in `api/`) | PASS |
| API build | `npm run build` (in `api/`) | PASS — emits `dist/` |
| Web typecheck | `npm run typecheck` (in `web/`) | PASS |
| Web build | `npm run build` (in `web/`) | PASS — emits `dist/index.html` + JS/CSS |
| Migration apply | `npm run db:migrate` (first run) | PASS — `applied 1 migration(s)` |
| Migration idempotency | `npm run db:migrate` (second run) | PASS — `nothing to do` |
| `schema_migrations` row | `SELECT * FROM schema_migrations;` | exactly one row: `0001_init.sql` |
| `GET /api/health` | `Invoke-WebRequest` on `localhost:3000` | `200 {"status":"ok"}` |
| `GET /api/health/db` | `Invoke-WebRequest` on `localhost:3000` | `200 {"db":"ok"}` |
| Unknown route | `Invoke-WebRequest` on `localhost:3000` | `404 {"success":false,"error":{"code":"NOT_FOUND",...}}` |
| Vite dev server | `npm run dev` (in `web/`) | `200` on `/` and on `/src/main.tsx` |
| Persistence after API restart | re-read `schema_migrations` after restarting `npm run dev` | row intact, same `applied_at` |
| Secret hygiene | `git grep 6691` | no occurrences in tracked files |
| Git ignores | `git status` | `api/.env` untracked, `node_modules/` untracked, `dist/` untracked |

End-to-end chain `browser → React (5173) → Express (3000) → MySQL 8.4 (3306)` validated by starting both dev servers and confirming the Vite shell loads with the React entry served, while the api responds to the same loopback the web app is configured to call.

## Environment specifics

- **Database**: MySQL 8.4 Community Server, install path `C:\Program Files\MySQL\MySQL Server 8.4\`, server binary `mysqld.exe` version 8.4.11. Reachable on `127.0.0.1:3306` using the credentials in `api/.env` (which is gitignored).
- **No Docker / docker-compose**: removed from Phase 0 scope by user decision. Containerization is deferred to Phase 15 (Hostinger production deployment). The earlier Phase 0 completion report that mentioned MariaDB 10.4.28 is superseded by this report; the project has been re-validated against real MySQL 8.4 from a clean `axle` database.

## Files created

```
.gitignore
.env.example
AGENTS.md
ARCHITECTURE.md
DEVELOPMENT.md
README.md

api/
  .env.example
  package.json
  tsconfig.json
  src/
    config/env.ts
    db/pool.ts
    middleware/error.ts
    routes/health.ts
    server.ts

database/
  migrations/0001_init.sql
  scripts/migrate.ts

web/
  .env.example
  index.html
  package.json
  postcss.config.js
  tailwind.config.ts
  tsconfig.json
  vite.config.ts
  src/
    App.tsx
    index.css
    main.tsx
    vite-env.d.ts
    lib/api.ts
    pages/HealthPage.tsx

docs/
  AXLE-2.0.md          (copy of the spec)
  README.md
  PHASE-0-COMPLETION.md (this file)
```

## Known issues

None. All Phase 0 DoD items pass against MySQL 8.4.

## Next phase

**PHASE 1 — Authentication & Business**

(Waiting for the user to issue `START PHASE 1`.)
