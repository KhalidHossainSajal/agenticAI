# AXLE 2.0 — Development Guide

How to work on this project day to day.

## Ground rules

1. **One phase at a time.** Read the phase spec in `docs/AXLE-2.0.md` before touching code.
2. **Stop conditions are real.** If a DoD item fails, fix it. Do not start the next phase.
3. **No silent redesigns.** If the spec is wrong, raise it before changing the architecture.
4. **Migrations are append-only.** Never edit a file that has been applied.
5. **No secrets in code or logs.** Read `AGENTS.md` for the full list.
6. **Tenant isolation is non-negotiable.** From Phase 1 onward, every tenant-scoped query must filter on `business_id`.

## Environment

You need:

- Node.js 20+ (tested on 22.23.1)
- npm 10+
- MySQL 8.4 reachable at the URL in `.env`

Verify with:

```powershell
node --version
npm --version
# Confirm MySQL:
mysql -h 127.0.0.1 -P 3306 -u root -p -e "SELECT VERSION();"
```

## Daily loop

```powershell
# 1. install (only when deps change)
cd api ; npm install ; cd ..
cd web ; npm install ; cd ..

# 2. apply any new migrations
cd api ; npm run db:migrate ; cd ..

# 3. run services
cd api ; npm run dev
# new terminal:
cd web ; npm run dev

# 4. before committing
cd api ; npm run build ; cd ..
cd web ; npm run build ; cd ..
```

## Phase completion

When a phase is fully validated:

1. Write `docs/PHASE-N-COMPLETION.md` using the template in `docs/AXLE-2.0.md` §20.
2. Stage and commit everything in that phase.
3. Tag the commit: `phase-N-name-complete`.
4. **Stop.** Wait for `START PHASE N+1`.

WIP phases get the tag `phase-N-name-wip` and are never considered complete.

## TypeScript

Both `api/` and `web/` ship a strict `tsconfig.json`. The build commands run `tsc --noEmit` for type-checking and emit JS for production. There is no `tslint` / `eslint`; we lean on the type checker.

## Debugging

- API logs go to stdout. Add `console.info(...)` in development; remove before commit if noisy.
- For MySQL queries, enable the `mysql2` `debug` option only in development.
- The health endpoints are the first place to look when something is broken end to end.

## Adding a new dependency

1. Check whether the spec already calls for it.
2. Check whether something already in the tree solves the problem.
3. If both no, propose it; install the smallest possible package; commit `package.json` and the lockfile.

## When you get stuck

- Re-read the relevant section of `docs/AXLE-2.0.md`.
- Re-read the relevant completion report from earlier phases.
- Do not invent a workaround that bypasses the spec.
