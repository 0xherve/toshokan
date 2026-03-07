# Backend Setup

This project is now split into:
- **Frontend app** (Vite/React)
- **Better Auth server** (app-owned auth identities)
- **Supabase** (books, chapters, file storage)

## 1) Database schema

Apply:

`supabase/migrations/202603072215_initial_app_schema.sql`

This creates app tables (`books`, `book_chapters`, progress, bookmarks, events, etc.).

## 2) Supabase storage bucket

Create bucket:

`books`

Admin upload writes EPUB files under:

`books/epubs/<uuid>-<filename>.epub`

## 3) Better Auth server

Start auth API:

```bash
bun run auth:dev
```

This serves:

`http://localhost:4000/api/auth/*` (default)

## 4) Frontend app

Start frontend:

```bash
bun run dev
```

## 5) Required env vars

Auth server (`server/auth-server.mjs`):
- `DATABASE_URL`
- `DATABASE_PASSWORD` (optional if embedded in URL)
- `BETTER_AUTH_SECRET` (or `AUTH_SECRET`)
- `APP_ORIGIN` (default `http://localhost:3000`)
- `AUTH_ORIGIN` (default `http://localhost:4000`)
- `AUTH_PORT` (default `4000`)

Optional Google OAuth:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Frontend:
- `PROJECT_URL` (Supabase project URL)
- `PUBLISHABLE_KEY` (Supabase publishable key)
- `VITE_AUTH_BASE_URL` (e.g. `http://localhost:4000`)

## 6) Make first admin

After signup, promote a user:

```bash
bun run auth:make-admin -- your@email.com
```

## 7) Sanitization model

Book sanitization happens at ingestion/upload:
1. EPUB uploaded
2. Chapters extracted
3. HTML sanitized
4. Sanitized chapters saved to `book_chapters`

Reader loads sanitized `book_chapters` first; EPUB parsing is fallback only.
