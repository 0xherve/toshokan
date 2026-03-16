# Toshokan - Light Novel Reader

## What is this?

A tasteful, personal light novel library and reader — chapter tracking, bookmarks, and a reading surface designed to disappear behind the words.

Production: `https://watashi.fun`

## Tech Stack

- **TanStack Router + React 19 + TypeScript** — client routing + app structure
- **Better Auth (server + client)** — app-owned authentication
- **Google OAuth (optional)** — social sign-in through Better Auth
- **Supabase Postgres + Storage** — book metadata/chapters and EPUB uploads
- **Drizzle ORM + drizzle-kit** — typed schema and SQL migrations
- **Vite 7** — dev server + build
- **Tailwind CSS v4** — styling (includes `@tailwindcss/typography`)
- **epub.js v0.3** — EPUB parsing (used directly, NOT the react-reader wrapper)
- **vite-plugin-pwa** — service worker, offline caching, installable PWA
- **Fonts** — loaded via CSS

## Architecture

### Reading Model: Scroll-per-chapter

The reader does NOT use epub.js's built-in iframe rendering. Instead:

1. Admin uploads EPUB from `/admin/books`
2. Upload pipeline stores file + extracts chapters + sanitizes HTML
3. Sanitized chapters are persisted in Supabase `book_chapters`
4. Reader loads persisted chapters first; falls back to EPUB parsing when needed
5. Tailwind styles apply natively — no iframe theming hacks

Each chapter is a full scrollable page. User scrolls through it, then hits "Next Chapter" at the bottom.

### File Structure

```
src/
├── App.tsx                    # App composition + router provider
├── client.tsx                 # Client entry + SW registration
├── router.tsx                 # Router factory using generated route tree
├── routes/                    # File routes (`/`, `/library`, `/books/*`, `/read/*`, `/admin/*`, `/auth`)
├── routeTree.gen.ts           # Auto-generated route tree (do not edit)
├── index.css                  # Tailwind + theme tokens + reader typography
├── pages/                     # Page components rendered by routes
├── components/
│   ├── Navbar.tsx             # Global nav (hidden in reader routes)
│   ├── Footer.tsx             # Global footer (hidden in reader routes)
│   ├── Reader.tsx             # Scrollable chapter content + tap zones
│   ├── TopBar.tsx             # Chapter title, TOC button, bookmark button
│   ├── BottomBar.tsx          # Progress bar, chapter info, settings button
│   ├── ChapterNav.tsx         # Slide-in TOC panel (from left)
│   ├── SettingsPanel.tsx      # Bottom sheet — theme picker, font size
│   ├── BookmarkList.tsx       # Slide-in bookmarks panel (from right)
│   └── LoadingScreen.tsx      # Spinner shown during chapter load
├── hooks/
│   ├── useEpubReader.ts       # Core — chapter load (Supabase + EPUB fallback)
│   ├── useBooks.ts            # Book list + upload + sanitization ingest
│   ├── useReadingProgress.ts  # Chapter index + scroll % tracking/persistence
│   ├── useTheme.ts            # Light/sepia/dark toggle + persistence
│   ├── useBookmarks.ts        # Add/remove bookmarks + persistence
│   └── useWakeLock.ts         # Prevent screen sleep via Wake Lock API
└── lib/
    ├── auth.tsx               # Better Auth client state provider
    ├── supabase.ts            # Supabase client for book storage
    ├── constants.ts           # Types, theme/font defaults
    └── storage.ts             # localStorage helpers (settings, position, bookmarks)

server/
├── auth.ts                   # Better Auth config + providers
└── db.ts                     # Drizzle pg connection for auth runtime
```

### Routes

- **Public**: `/` (landing), `/about`, `/library`, `/books/$bookSlug`
- **Reader**: `/read/` (index), `/read/$bookId` (full-screen reader shell)
- **Auth**: `/auth`
- **Admin**: `/admin` (dashboard), `/admin/books`, `/admin/ingestion`, `/admin/users`, `/admin/audit`

### Data Flow

```
Supabase books/book_chapters
  → useEpubReader (DB chapters first, EPUB fallback)
    → chapters[] in state
      → Reader component (renders current chapter)
        → useReadingProgress (tracks scroll %, persists to localStorage)

User taps center of screen → toggles TopBar/BottomBar visibility
User taps TOC → ChapterNav slides in from left
User taps settings → SettingsPanel slides up from bottom
User taps bookmark → saves current position with text excerpt
```

### Persistence (all localStorage)

| Key | Value | Purpose |
|-----|-------|---------|
| `sr-settings` | `{ theme, fontSize }` | User preferences |
| `sr-chapter-index` | number | Current chapter |
| `sr-scroll-positions` | `{ [chapter]: percent }` | Scroll position per chapter |
| `sr-bookmarks` | Bookmark[] | Saved bookmarks with excerpts |

### Theme System

Three themes defined as CSS custom properties on `[data-theme]`:
- **Light** — cream background, dark text
- **Sepia** — warm tan, brown text (classic e-reader)
- **Dark** — near-black, gray text (default)

Theme is applied to `<html>` before React hydrates (in `client.tsx`) to prevent flash.

## Key Decisions

- **No iframe rendering** — epub.js rendition uses iframes which block Tailwind styling and fight scroll behavior. We extract HTML directly instead.
- **Scroll, not paginated** — full chapter scroll instead of CSS-column pagination. More natural on mobile.
- **Book source of truth in Supabase** — book metadata and chapters come from DB/storage.
- **Public Sans** — loaded from Google Fonts CDN, not self-hosted (font file download issues).
- **Upload-time sanitization** — chapter HTML is sanitized during ingestion, not only at render time.

## Development

```bash
# Install (run from the SAME environment you'll use for dev)
bun install

# Run dev server
bun run dev

# Drizzle migrations
bun run db:migrate

# Build
bun run build

# Preview production build
bun run preview

# Lint
bun run lint
```

## Environment Variables

See [`BACKEND_SETUP.md`](./BACKEND_SETUP.md) for backend/frontend env setup (Supabase, Better Auth, optional Google OAuth).
