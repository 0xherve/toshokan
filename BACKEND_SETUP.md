# Backend Setup

This app runs with:
- App runtime: TanStack Start (single server process)
- Auth API: Better Auth mounted at `/api/auth/*` via `src/start.ts`
- Data: Supabase Postgres + Storage

## 1) Run database migrations

```bash
bun run db:migrate
```

Schema source: `src/db/schema.ts`

## 2) Supabase storage bucket

Create a public bucket named `books`.

EPUB uploads are stored at:
`books/epubs/<uuid>-<filename>.epub`

## 3) Required env vars

Core:
- `DATABASE_URL`
- `DATABASE_PASSWORD` (optional, used if URL still has `[YOUR-PASSWORD]`)
- `BETTER_AUTH_SECRET` (or `AUTH_SECRET`)
- `APP_ORIGIN` (default `http://localhost:3000`)
- `BETTER_AUTH_URL` (optional; defaults to `APP_ORIGIN`)

Frontend:
- `PROJECT_URL` (Supabase project URL)
- `PUBLISHABLE_KEY` (Supabase publishable key)
- `VITE_AUTH_BASE_URL` (optional; use only if auth is served on a different origin)

Google OAuth (optional):
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Google redirect URI:
- `${APP_ORIGIN}/api/auth/callback/google`
- Example: `http://localhost:3000/api/auth/callback/google`

## 4) Start the app

```bash
bun run dev
```

Auth base path:
- `http://localhost:3000/api/auth/*`

## 5) Promote first admin

```bash
bun run auth:make-admin -- your@email.com
```

## 6) Ingestion model

Book sanitization happens during upload:
1. EPUB uploaded
2. Chapters extracted
3. HTML sanitized
4. Sanitized chapters saved to `book_chapters`
