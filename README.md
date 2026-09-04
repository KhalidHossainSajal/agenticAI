<<<<<<< HEAD
# agenticAI
=======
# AXLE 2.0

AI Business Agent Platform.

A multi-tenant SaaS that lets businesses create AI assistants from their own knowledge, connect AI providers (Gemini, OpenAI), expose them on websites, and (eventually) voice + external channels.

> **Build small. Verify everything. Never skip a phase.**

The full product vision and phase roadmap live in [`docs/AXLE-2.0.md`](./docs/AXLE-2.0.md). Read that first.

---

## Local development

This repository is a clean Phase 0 foundation. Two services run side by side:

| Service | Tech            | Port | Folder  |
|---------|-----------------|------|---------|
| API     | Node + Express  | 3000 | `api/`  |
| Web     | Vite + React    | 5173 | `web/`  |
| Database| MySQL 8.4       | 3306 | host    |

> Docker / docker-compose are **not** part of Phase 0. Local dev runs on the host.

### Prerequisites

- Node.js 20+ (tested on 22.23.1)
- npm 10+
- MySQL 8.4 running on `localhost:3306` with a database named `axle` and a user that can `CREATE TABLE`

### One-time setup

```powershell
# install deps for both services
cd web  ; npm install ; cd ..
cd api  ; npm install ; cd ..

# copy env files and edit values
Copy-Item .env.example .env
Copy-Item api/.env.example api/.env
# edit .env so DATABASE_URL points at your local MySQL
```

### Run

```powershell
# terminal 1: api (also runs migrations on first request / via db:migrate)
cd api
npm run db:migrate     # one-time, or whenever a new migration lands
npm run dev            # http://localhost:3000

# terminal 2: web
cd web
npm run dev            # http://localhost:5173
```

### Build (production check)

```powershell
cd api ; npm run build ; cd ..
cd web ; npm run build ; cd ..
```

### Health endpoints

```text
GET  http://localhost:3000/api/health       -> { "status": "ok" }
GET  http://localhost:3000/api/health/db    -> { "db": "ok" }  or 5xx on failure
```

Open `http://localhost:5173` for a health dashboard that calls both.

---

## Repository layout

```
.
├── api/                 # Express + TypeScript backend
│   ├── src/
│   │   ├── config/      # env loading (zod)
│   │   ├── db/          # mysql2 pool
│   │   ├── middleware/  # error handling
│   │   ├── routes/      # /api/health, ...
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── web/                 # Vite + React + TS + Tailwind dashboard
│   ├── src/
│   │   ├── lib/api.ts
│   │   └── pages/HealthPage.tsx
│   └── package.json
├── database/
│   ├── migrations/      # append-only *.sql, lex-ordered
│   └── scripts/migrate.ts   # custom migration runner
├── docs/                # spec + per-phase completion reports
├── .env.example
├── .gitignore
├── ARCHITECTURE.md
├── DEVELOPMENT.md
├── AGENTS.md
└── README.md
```

## Phase status

| Phase | Title                       | Status      |
|-------|-----------------------------|-------------|
| 0     | Foundation                  | in progress |
| 1     | Authentication & Business   | not started |
| 2     | AI Providers / BYOK         | not started |
| 3     | AI Agent                    | not started |
| 4     | Knowledge Base / RAG        | not started |
| 5     | Website Text Chat           | not started |
| 6     | Conversation System         | not started |
| 7     | Voice Agent                 | not started |
| 8     | Website Floating Call       | not started |
| MVP   | tag `mvp-complete`          | not started |

See [`docs/AXLE-2.0.md`](./docs/AXLE-2.0.md) for the full phase definitions and Stop conditions.
>>>>>>> b1dcf3d (phase-0-foundation-complete)
