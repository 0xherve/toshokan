# Toshokan - EPUB Reader PWA

## What is this?

A mobile-first Progressive Web App for better `Light novel` reading UX. Initially designed for comfortable, distraction-free reading of **Shadow Slave**.

## Tech Stack

- **React 19 + TypeScript** — UI framework
- **Vite 7** — build tool, dev server, HMR
- **Tailwind CSS v4** + `@tailwindcss/typography` — styling
- **epub.js v0.3** — EPUB parsing (used directly, NOT the react-reader wrapper)
- **vite-plugin-pwa** — service worker, offline caching, installable PWA
- **Vercel Blob** — EPUB file hosting (CDN-backed)
- **Google Fonts** — Public Sans font (imported via CSS)

## Architecture

### Reading Model: Scroll-per-chapter

The reader does NOT use epub.js's built-in iframe rendering. Instead:

1. `useEpubReader` parses the EPUB with epub.js
2. Extracts raw HTML from each spine item (`section.document.body.innerHTML`)
3. Sanitizes it (strips `<script>` tags)
4. Renders it directly in React via `dangerouslySetInnerHTML`
5. Tailwind styles apply natively — no iframe theming hacks

Each chapter is a full scrollable page. User scrolls through it, then hits "Next Chapter" at the bottom.

### File Structure

```
src/
├── App.tsx                    # Root — wires hooks + components together
├── main.tsx                   # Entry — theme pre-load, React mount
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
│   ├── useEpubReader.ts       # Core — EPUB load, parse, chapter extraction
│   ├── useReadingProgress.ts  # Chapter index + scroll % tracking/persistence
│   ├── useTheme.ts            # Light/sepia/dark toggle + persistence
│   ├── useBookmarks.ts        # Add/remove bookmarks + persistence
│   └── useWakeLock.ts         # Prevent screen sleep via Wake Lock API
└── lib/
    ├── constants.ts           # EPUB URL, types, theme/font defaults
    └── storage.ts             # localStorage helpers (settings, position, bookmarks)
```

### Data Flow

```
EPUB URL (Vercel Blob)
  → useEpubReader (parse + extract HTML)
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
- **External EPUB hosting** — file hosted on Vercel Blob CDN, not bundled in repo (too large).
- **Public Sans** — loaded from Google Fonts CDN, not self-hosted (font file download issues).
- **localStorage over IndexedDB** — simpler, sufficient for settings/bookmarks/position data.

## Development

```bash
# Install (run from the SAME environment you'll use for dev)
bun install

# Dev server
bun run dev

# Build
bun run build

# Preview production build
bun run preview

# Lint
bun run lint
```

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_EPUB_URL` | Override EPUB source URL | Vercel Blob URL in constants.ts |
