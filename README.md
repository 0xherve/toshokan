# Toshokan

An opinionated light novel library and reader.

Production: `https://watashi.fun`

## Stack

- **TanStack Start + React 19** — SSR, file routing, `createServerFn` RPC
- **Better Auth** — email/password + Google OAuth
- **Neon Postgres + Drizzle ORM** — book metadata, chapters, user data
- **Cloudflare R2** — EPUB file storage (S3-compatible)
- **Dexie (IndexedDB)** — offline chapter cache, reading progress, bookmarks
- **Tailwind CSS v4** — styling
- **vite-plugin-pwa** — service worker, installable PWA

## Routes

- Public: / (landing), /about, /library, /books/$bookSlug
- Reader: /read/$bookId (full-screen reader shell)
- Auth: /auth/login, /auth/signup, /auth/forgot-password

## How it works

1. Admin uploads an EPUB novel with details (title, author, cover image)
2. EPUB is parsed client-side, chapters extracted and sanitized
3. Raw file goes to R2, chapters go to Postgres
4. Reader loads chapters from Dexie cache first, fetches missing ranges from server
5. Progress and bookmarks sync: write to IndexedDB immediately, debounce push to server

Each chapter is a full scrollable page. No iframes, no epub.js renderer.

## Development

```bash
bun install
bun run dev          # dev server on :3000
bun run db:generate  # run Drizzle schema generation
bun run db:migrate   # run Drizzle migrations
bun run build        # build for production
```

## Env config

```
DATABASE_URL=         # Neon connection string
BETTER_AUTH_SECRET=   # session signing secret
R2_ACCOUNT_ID=        # Cloudflare account ID
R2_ACCESS_KEY_ID=     # R2 access key
R2_SECRET_ACCESS_KEY= # R2 secret key
R2_BUCKET_NAME=       # R2 bucket name
GOOGLE_CLIENT_ID=     # optional, for Google OAuth
GOOGLE_CLIENT_SECRET= # optional
APP_ORIGIN=           # e.g. https://tosho.polimath.dev
```
