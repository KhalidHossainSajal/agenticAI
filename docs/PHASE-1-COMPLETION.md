# PHASE 1 — COMPLETION REPORT

**Status:** COMPLETE

## Goal recap

A user can create an account, log in, and create/manage a business with strict tenant isolation:

> Register → Login → Create business → Business dashboard → Settings

## Implemented

### Database (`0002_auth.sql`)

- `users` — `id`, `email UNIQUE`, `password_hash`, `name`, timestamps.
- `businesses` — `id`, `name`, `slug UNIQUE`, `created_by FK→users`, timestamps.
- `business_members` — `id`, `business_id FK`, `user_id FK`, `role ENUM('owner','admin','member')`, `UNIQUE(business_id, user_id)`. Cascading deletes from `businesses`/`users`.

All three are `InnoDB`, `utf8mb4`, with proper indexes and FK constraints. Migration is append-only.

### API

- `POST /api/auth/register` → `{token, user}` (201)
- `POST /api/auth/login` → `{token, user}` (200) / 401 `INVALID_CREDENTIALS`
- `POST /api/auth/logout` → `{loggedOut: true}` (token jti blacklisted in-process)
- `GET  /api/auth/me` → `{user}` (auth required)
- `POST /api/businesses` → creates business + `owner` membership; returns the business
- `GET  /api/businesses` → list businesses the caller belongs to
- `GET  /api/businesses/:id` → membership-checked; 403 `FORBIDDEN` otherwise
- `PATCH /api/businesses/:id` → `owner` only
- `GET  /api/businesses/:id/members` → membership-checked

Auth: `argon2id` (memoryCost 19456, timeCost 2, parallelism 1) for passwords; `jsonwebtoken` HS256 with 7-day expiry; `jti` per token, in-memory blacklist for logout. `JWT_SECRET` is zod-validated to be ≥16 characters. Tenant middleware `requireBusinessAccess` enforces `WHERE business_id = ? AND user_id = ?` on every business route.

All responses use the spec §16 envelope: `{success, data}` / `{success:false, error:{code,message}}`. No stack traces are returned to clients.

### Web

- `AuthProvider` context with persistent token + user in `localStorage`; auto-verifies on mount via `/api/auth/me`.
- `/login`, `/register`, `/dashboard`, `/businesses/:id` pages, plus a protected-route wrapper that redirects unauthenticated users to `/login`.
- `react-router-dom@6` BrowserRouter; SPA shell served by Vite on port 5173.
- `HealthPage` retained for the unauthenticated landing.
- Tailwind utility classes for the shared `axle-input`, `axle-btn-primary`, `axle-btn-secondary` styles.

## Validation performed

| Check | Command | Result |
|-------|---------|--------|
| API typecheck | `npm run typecheck` (in `api/`) | PASS |
| API build | `npm run build` (in `api/`) | PASS |
| Web typecheck | `npm run typecheck` (in `web/`) | PASS |
| Web build | `npm run build` (in `web/`) | PASS — 41 modules, ~179 kB JS gzipped 57 kB |
| Migration apply (1st) | `npm run db:migrate` | PASS — `applied 1 migration(s)` |
| Migration idempotency (2nd) | `npm run db:migrate` | PASS — `nothing to do` |
| `SHOW TABLES` | mysql shell | `business_members, businesses, schema_migrations, users` |
| Register Alice | `POST /api/auth/register` | 201 + token |
| Duplicate email (case-insensitive) | `POST /api/auth/register` (ALICE@example.com) | 409 `EMAIL_TAKEN` |
| Short password | `POST /api/auth/register` (pwd=7 chars) | 400 `VALIDATION_ERROR` |
| Login (correct) | `POST /api/auth/login` | 200 + token |
| Login (wrong password) | `POST /api/auth/login` (wrong pwd) | 401 `INVALID_CREDENTIALS` |
| `/me` with token | `GET /api/auth/me` | 200 + user |
| Create business | `POST /api/businesses` | 201; Alice becomes `owner` |
| List businesses | `GET /api/businesses` | includes new business |
| Get business | `GET /api/businesses/1` | 200 |
| Patch as owner | `PATCH /api/businesses/1` (Alice) | 200, name updated |
| Members | `GET /api/businesses/1/members` | Alice only, role `owner` |
| Register Bob | `POST /api/auth/register` | 201 |
| Bob list businesses | `GET /api/businesses` (Bob) | `[]` (empty) |
| Bob get Alice's biz | `GET /api/businesses/1` (Bob) | 403 `FORBIDDEN` |
| Bob patch Alice's biz | `PATCH /api/businesses/1` (Bob) | 403 `FORBIDDEN` |
| Bob members | `GET /api/businesses/1/members` (Bob) | 403 `FORBIDDEN` |
| Alice's biz unchanged | re-fetch after Bob's PATCH | still `name: "Acme Inc"` |
| Unauthed request | `GET /api/auth/me` (no header) | 401 `UNAUTHENTICATED` |
| Bad token | `GET /api/auth/me` (bad header) | 401 `INVALID_TOKEN` |
| Logout | `POST /api/auth/logout` (Alice) | 200 |
| `/me` after logout | `GET /api/auth/me` (same token) | 401 `TOKEN_REVOKED` |
| Vite dev server `/` | `Invoke-WebRequest` | 200 `text/html` |
| Vite SPA `/dashboard` | `Invoke-WebRequest` | 200 (SPA shell) |
| Vite dev server `/src/main.tsx` | `Invoke-WebRequest` | 200 |
| Tracked secrets | `git grep 6691` | only the Phase 0 self-referential check row |

End-to-end chain `Browser → React/Vite → Express → mysql2 → MySQL 8.4` validated for the Phase 1 surface.

## Bug found and fixed during validation

The custom migration runner's `splitStatements` filter `/^--/.test(s)` matched on the trimmed statement's first line. When a migration's first non-empty line was a `--` comment (as in `0002_auth.sql`), the entire `CREATE TABLE users` block was filtered out before being sent to MySQL, leaving only the `businesses` statement — which then failed on its FK to the missing `users` table.

Fix: rewrite `splitStatements` to first strip line comments and then split on the `;` separator, removing the brittle first-line filter. The runner is otherwise unchanged and still append-only, transactional, and idempotent.

This was a runner bug, not a schema bug. The migration file itself is correct.

## Files created / changed

```
M  .env.example
M  AGENTS.md            (unchanged from Phase 0)
M  api/.env.example
M  api/package.json     (argon2, jsonwebtoken, @types/jsonwebtoken)
M  api/package-lock.json
M  api/src/config/env.ts (JWT_SECRET min 16)
M  api/src/middleware/auth.ts   (new)
M  api/src/middleware/tenant.ts (new)
M  api/src/middleware/validate.ts (new)
M  api/src/repositories/users.ts (new)
M  api/src/repositories/businesses.ts (new)
M  api/src/routes/auth.ts (new)
M  api/src/routes/businesses.ts (new)
M  api/src/server.ts (mounts the new routers)
M  api/src/services/jwt.ts (new)
M  api/src/services/tokenBlacklist.ts (new)
M  database/migrations/0002_auth.sql (new)
M  database/scripts/migrate.ts (comment-stripping fix)
M  web/package.json (react-router-dom)
M  web/package-lock.json
M  web/src/App.tsx (router + AuthProvider)
M  web/src/index.css (component utilities)
M  web/src/lib/api.ts (token-aware request helpers)
M  web/src/lib/auth.tsx (new)
M  web/src/lib/business.ts (new)
M  web/src/main.tsx (BrowserRouter)
M  web/src/pages/BusinessPage.tsx (new)
M  web/src/pages/DashboardPage.tsx (new)
M  web/src/pages/LoginPage.tsx (new)
M  web/src/pages/RegisterPage.tsx (new)
```

## Known limitations (carried into later phases)

- Token blacklist is process-local. Survives process restarts only as long as the server does. A persistent store lands when subscription / production hardening begins.
- `localStorage` is used for the web token. This is a Phase 1 simplification; Phase 13 will revisit session hardening.
- `react-router-dom` is the only web dependency added; the spec permits a router so this is allowed.
- `argon2` is a native module; the lockfile pins a prebuild for the current Node/arch. If the deploy target ever needs a different platform, the install must be re-run there.

## Known issues

None. All Phase 1 DoD items pass.

## Next phase

**PHASE 2 — AI Providers / BYOK**

(Waiting for the user to issue `START PHASE 2`.)
