# Watashi - EPUB Reader PWA

## What is this?

A tasteful, personal light novel library. Initially designed for comfortable, distraction-free reading of **Shadow Slave**.

Production: https://watashi.fun

## Tech Stack

- **React 19 + TypeScript + TanStack Router** — app + routing framework
- **Better Auth (server + client)** — app-owned authentication model
- **Supabase Postgres + Storage** — book metadata/chapters and EPUB uploads
- **Vite 7** — build tool, dev server, HMR
- **Tailwind CSS v4** + `@tailwindcss/typography` — styling
- **epub.js v0.3** — EPUB parsing (used directly, NOT the react-reader wrapper)
- **vite-plugin-pwa** — service worker, offline caching, installable PWA
- **Google Fonts** — Public Sans font (imported via CSS)

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
├── App.tsx                    # Root — wires hooks + components together
├── main.tsx                   # Entry — theme pre-load, TanStack Router mount
├── router.tsx                 # TanStack Router route tree (`/`, `/reader/$bookId`, `/admin/*`)
├── index.css                  # Tailwind imports, themes, reader typography
├── components/
│   ├── Reader.tsx             # Scrollable chapter content + tap zones
│   ├── TopBar.tsx             # Chapter title, TOC button, bookmark button
│   ├── BottomBar.tsx          # Progress bar, chapter info, settings button
│   ├── ChapterNav.tsx         # Slide-in TOC panel (from left)
│   ├── SettingsPanel.tsx      # Bottom sheet — theme picker, font size
│   ├── BookmarkList.tsx       # Slide-in bookmarks panel (from right)
│   └── LoadingScreen.tsx      # Spinner shown during EPUB parse
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
```

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

Theme is applied to `<html>` before React renders (in main.tsx) to prevent flash.

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

# Better Auth server (required for real sign-in/sign-up)
bun run auth:dev

# Frontend dev server
bun run dev

# Build
bun run build

# Preview production build
bun run preview

# Lint
bun run lint
```

## Environment Variables

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for complete backend/frontend env setup.
