# Backend Setup

This app runs with:
- App runtime: TanStack Start (single server process)
- Auth API: Better Auth mounted at `/api/auth/*` via `src/start.ts`
- Database: Neon (PostgreSQL) via Drizzle ORM
- File storage: Cloudflare R2 (S3-compatible) for EPUB uploads
- Offline layer: Dexie (IndexedDB) for chapter cache + reading state

## Architecture

```
Browser
  ├── Dexie (IndexedDB)       — chapter cache, offline reads/writes
  ├── createServerFn calls    — all data reads/writes via RPC
  └── Better Auth client      — session management only

TanStack Start Server
  ├── /api/auth/*             — Better Auth handler
  └── server/functions/**    — auth-checked Drizzle queries

Neon (PostgreSQL) — database
Cloudflare R2     — EPUB file storage
```

## 1) Run database migrations

```bash
bun run db:generate
bun run db:migrate
```

Schema source: `src/db/schema.ts`

## 2) Required env vars

Core:
- `DATABASE_URL` — Neon connection string
- `DATABASE_PASSWORD` (optional, used if URL still has `[YOUR-PASSWORD]`)
- `BETTER_AUTH_SECRET` (or `AUTH_SECRET`)
- `APP_ORIGIN` (default `http://localhost:3000`)

Cloudflare R2:
- `R2_ENDPOINT` — e.g. `https://<account_id>.r2.cloudflarestorage.com`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET` (default: `toshokan`)

Frontend:
- `VITE_AUTH_BASE_URL` (optional; use only if auth is served on a different origin)

Google OAuth (optional):
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Google redirect URI:
- `${APP_ORIGIN}/api/auth/callback/google`

## 3) Start the app

```bash
bun run dev
```

Auth base path: `http://localhost:3000/api/auth/*`

## 4) Promote first admin

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## 5) Ingestion model

Book upload happens via the admin panel:
1. Admin selects EPUB file
2. Browser extracts + sanitizes chapters (epubjs + DOMParser)
3. Server function uploads EPUB to R2, saves chapters to DB
4. Reader loads chapters from DB via `getChapterRange`, caches in IndexedDB
