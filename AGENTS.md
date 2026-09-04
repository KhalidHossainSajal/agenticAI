# AXLE 2.0 — AI Coding Agent Rules

These rules apply to every AI coding agent (Kilo Code, or any other tool) that touches this repository.

## 1. Read before editing

Before modifying code:

- Read the relevant section of `docs/AXLE-2.0.md`.
- Read the latest phase completion report in `docs/`.
- Read the surrounding files in the area you intend to change.

Do not blindly overwrite working code.

## 2. Work only on the current phase

If the current phase is `PHASE 2`, do not implement `PHASE 7` features unless the user explicitly asks for them. The roadmap in `docs/AXLE-2.0.md` and the per-phase plan are the source of truth.

## 3. Do not invent requirements

If something is not defined, use the simplest reasonable implementation. Do not introduce:

- new tables the phase did not ask for
- new services, queues, or workers
- new dependencies that the spec did not require

## 4. Keep files small

Prefer the existing structure: `routes / controllers / services / repositories / providers / utils / middleware`. A file should rarely exceed a few hundred lines. If it grows, split it.

## 5. No fake implementations

Do not claim a feature is implemented when it only returns hardcoded data, an in-memory map, or a mocked response. If a piece of functionality is genuinely unavailable, return a `501` with a clear error code.

## 6. No silent fallbacks

Do not silently fall back to a mock when a real provider is misconfigured. Surface the error to the caller and to the logs.

## 7. Test after every change

After touching code:

1. `npm run build` in the affected service.
2. Run the dev server.
3. Exercise the relevant endpoint or UI flow manually.
4. Re-read the DoD for the current phase and confirm every box can be checked.

## 8. Security baseline

- Never log: API keys, passwords, `JWT_SECRET`, `ENCRYPTION_KEY`, decrypted provider credentials.
- Never return decrypted provider keys from any API response.
- Always use SQL parameter binding (`?` placeholders). Never string-concatenate user input into a query.
- Every tenant-scoped query filters on `business_id`. No exceptions.

## 9. Phase gate

Before declaring a phase complete:

- [ ] All DoD items in `docs/AXLE-2.0.md` for that phase pass.
- [ ] `tsc --noEmit` clean in `api/` and `web/`.
- [ ] `npm run build` passes in `api/` and `web/`.
- [ ] Manual validation script in the phase plan was executed.
- [ ] `docs/PHASE-N-COMPLETION.md` exists and matches the spec §20 template.
- [ ] One commit + one tag (`phase-N-name-complete`).

If any item is missing, the phase is **not** complete. Do not move on.

## 10. Do not start the next phase automatically

After committing a phase, **stop** and wait for the user to issue `START PHASE N+1`.
