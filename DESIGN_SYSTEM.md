# Watashi Design System

## Brand Identity

**Watashi** (Japanese: "I/me") is a personal, single-user EPUB reader PWA. The name signals intimacy and ownership — this is *your* reading space.

**Tagline:** "A tasteful, personal light novel library"

**Design philosophy:** The interface should disappear. Every pixel exists to serve the reading experience. The app should feel like a well-worn paperback — familiar, comfortable, invisible. No feature should demand attention; everything waits quietly until summoned.

**Target user:** A single person who reads long-form serialized fiction (light novels, web novels) on their phone, often in bed or on transit. They read hundreds of chapters. They value comfort over features.

---

## Color System

Three themes, each defined as semantic CSS custom properties on `[data-theme]`. The palette is intentionally small — no status colors, no gradients, no decorative color. Every color serves a structural role.

### Semantic Tokens

| Token | Role | Usage |
|-------|------|-------|
| `--bg-app` | Deepest background | Page body, empty states |
| `--bg-reader` | Reading surface | The content area where text lives |
| `--bg-surface` | Elevated surface | Bars, panels, cards — anything layered above the reader |
| `--bg-primary` | Primary action fill | "Next chapter" button, install CTA |
| `--bg-primary-hover` | Primary action hover | Hover/press state for primary actions |
| `--text-on-primary` | Text on primary fill | Button labels on `--bg-primary` |
| `--text-primary` | Body text | Chapter content, headings, main labels |
| `--text-secondary` | Supporting text | Subtitles, excerpts, descriptions |
| `--text-muted` | De-emphasized text | Metadata, counters, hints, empty states |
| `--border` | Dividers and outlines | Separators, input borders, card edges |
| `--accent` | Interactive accent | Links, active indicators |
| `--accent-hover` | Accent hover state | Hovered links |
| `--overlay` | Backdrop for panels | Semi-transparent overlay behind slide-in panels |

### Theme Palettes

**Dark (default)** — near-black canvas, soft gray text. Optimized for nighttime reading. This is the primary theme; all design decisions should look best here first.

```
--bg-app:            #111111
--bg-reader:         #1a1a1a
--bg-surface:        #222222
--bg-primary:        #ffffff
--text-primary:      #d4d4d4
--text-secondary:    #a0a0a0
--text-muted:        #666666
--border:            #333333
--overlay:           rgba(0, 0, 0, 0.6)
```

**Light** — cream-white canvas, near-black text. Clean and sharp for daytime.

```
--bg-app:            #fafaf8
--bg-reader:         #ffffff
--bg-surface:        #f5f5f3
--bg-primary:        #1a1a1a
--text-primary:      #1a1a1a
--text-secondary:    #555555
--text-muted:        #999999
--border:            #e5e5e5
--overlay:           rgba(0, 0, 0, 0.3)
```

**Sepia** — warm tan canvas, brown text. Classic e-reader warmth.

```
--bg-app:            #f4ecd8
--bg-reader:         #f8f1e0
--bg-surface:        #ede3cb
--bg-primary:        #7a5a3a
--text-primary:      #5b4636
--text-secondary:    #7a6352
--text-muted:        #a08b76
--border:            #d4c5a9
--overlay:           rgba(0, 0, 0, 0.3)
```

### Design Principle: Monochromatic

Each theme is monochromatic — no blue links, no red errors, no green success. The accent color is always the theme's own text color at full intensity. This keeps the reading environment calm. Status or error states should use text weight/size changes, not color.

---

## Typography

### Font

**Public Sans** — a neutral, highly-legible sans-serif from Google Fonts. Variable weight (100-900), italic axis. Chosen for its invisible readability at long reading sessions.

```css
font-family: "Public Sans", system-ui, sans-serif;
```

### Type Scale

The app uses two distinct type contexts:

**1. Reader content** — user-configurable:

| Property | Value | Notes |
|----------|-------|-------|
| Base size | `18px` (default) | User-adjustable: 14px - 28px in 2px steps |
| Line height | `1.75` | Generous for long-form prose |
| Paragraph spacing | `1em` margin-bottom | Standard prose rhythm |
| H1 | `1.6em` / 700 weight | Chapter titles within content |
| H2 | `1.3em` / 700 weight | Section breaks |
| H3 | `1.1em` / 700 weight | Sub-sections |
| Heading top margin | `1.5em` | Breathing room before headings |
| Max content width | `38em` | Optimal reading line length (~65-75 chars) |

**2. UI chrome** — fixed, uses Tailwind's type scale:

| Element | Tailwind class | Approx size |
|---------|---------------|-------------|
| Panel titles | `text-lg font-bold` | 18px / 700 |
| Chapter title (top bar) | `text-sm font-bold` | 14px / 700 |
| Body/labels | `text-sm` | 14px / 400 |
| Metadata/captions | `text-xs` | 12px / 400 |
| Badge text | `text-[10px] uppercase tracking-wide` | 10px / 400 |
| Section labels | `text-xs font-medium uppercase tracking-wider` | 12px / 500 |

### Font Weight Usage

| Weight | Semantic use |
|--------|-------------|
| 400 (regular) | Body text, chapter list items, metadata |
| 500 (medium) | Section labels, bookmark titles |
| 600 (semibold) | Active chapter in TOC, install CTA |
| 700 (bold) | Headings, bar titles, brand name |

---

## Spacing

Uses Tailwind's default 4px base grid. Key recurring values:

| Context | Value | Usage |
|---------|-------|-------|
| Page padding (reader) | `px-5` (20px) | Horizontal padding for reading content |
| Page padding (vertical) | `py-16` (64px) | Top/bottom breathing room for content |
| Panel padding | `p-4` (16px) | Standard panel inset |
| Panel body padding | `px-6` (24px) | Settings panel wider inset |
| Bar height (top) | `h-12` (48px) | Top navigation bar |
| Bar height (bottom) | `h-11` (44px) | Bottom status bar |
| Button touch target | `p-2` (8px padding) | Icon buttons minimum 36x36 touch area |
| Gap between buttons | `gap-1` (4px) | Tight icon button groups |
| Gap in nav buttons | `gap-4` (16px) | Prev/Next chapter buttons |
| Section spacing | `mt-3` (12px) | Between form elements in panels |
| Content separator | `mt-16 pt-8` (64px + 32px) | Before chapter nav buttons |

### Panel Widths

| Panel | Width | Max |
|-------|-------|-----|
| Side panels (TOC, bookmarks, theme) | `w-72` (288px) | `max-w-[80vw]` |
| Install toast | — | `max-w-[32rem]` (512px) |
| Reader content | — | `max-w-[38em]` (~608px at 16px) |

---

## Layout Architecture

### Screen Layers (z-index)

```
z-0   Reader (full-screen scroll container, fixed inset-0)
z-40  TopBar / BottomBar (chrome overlays)
z-50  Panels + overlays (ChapterNav, BookmarkList, ThemePanel, SettingsPanel)
z-50  InstallToast (floating bottom card)
```

### Layout Primitives

**1. Full-bleed scroll container** — The reader owns the entire viewport (`fixed inset-0, overflow-y-auto`). Content is a centered `<article>` with max-width constraint.

**2. Sticky bar** — Top and bottom bars slide in/out via `translateY`. The top bar is always visible (sticky); the bottom bar toggles on tap.

**3. Slide-in panel (from left)** — Table of Contents. Full-height, anchored to left edge. Overlay backdrop behind it.

**4. Slide-in panel (from right)** — Bookmarks and Theme panels. Full-height, anchored to right edge. Overlay backdrop.

**5. Bottom sheet** — Settings panel. Slides up from bottom with a drag handle indicator (pill-shaped `w-10 h-1 rounded-full`).

**6. Floating card** — Install toast. Fixed to bottom, centered, with border + shadow.

### Panel Anatomy

Every panel follows the same structure:
```
[Overlay backdrop]  (fixed inset-0, semi-transparent, click-to-close)
[Panel container]   (fixed to edge, slides via transform, overflow-y-auto)
  [Header]          (p-4, title + subtitle)
  [Content]         (scrollable body)
```

---

## Component Patterns

### Buttons

**Primary button** — filled background, high contrast text:
```
bg: var(--bg-primary)
text: var(--text-on-primary)
border: 1px solid var(--border)
radius: rounded-xl (12px)
padding: py-3, full-width (flex-1)
font: text-sm font-medium
```

**Ghost button** — text-only, used in bar actions:
```
bg: transparent
text: var(--text-primary) or var(--text-secondary)
radius: rounded-lg (8px)
padding: p-2 (icon buttons), px-3 py-2 (text buttons)
```

**Surface button** — subtle fill, secondary actions:
```
bg: var(--bg-surface) or var(--bg-app)
text: var(--text-primary)
radius: rounded-xl (12px)
padding: py-3, full-width
font: text-sm font-medium
```

**Theme swatch button** — shows its own theme colors:
```
bg: theme's own background color
text: theme's own text color
border: 1px solid var(--border), 2px solid var(--text-primary) when active
radius: rounded-xl (12px)
padding: py-3
font: text-sm font-medium
```

### All buttons use `cursor-pointer` and `transition-colors`.

### Form Controls

**Text input:**
```
bg: var(--bg-app)
text: var(--text-primary)
border: 1px solid var(--border)
radius: rounded-lg (8px)
padding: px-3 py-2
font: text-sm
outline: none
```

**Select dropdown:** Same styling as text input.

**Range slider:** Native `<input type="range">` with `accent-[var(--accent)]`.

### Cards / List Items

**Chapter list item:**
```
layout: full-width button, text-left
padding: px-4 py-3
bg: transparent (var(--bg-app) when active)
font-weight: 400 (600 when active)
primary text: text-sm, var(--text-primary)
secondary text: text-xs, var(--text-secondary), truncated
```

**Bookmark list item:**
```
layout: full-width, stacked vertically
padding: px-4 py-3
border-bottom: 1px solid var(--border)
title: text-sm font-medium, var(--text-primary)
excerpt: text-xs, var(--text-secondary), line-clamp-2
metadata: text-xs, var(--text-muted)
action: text-xs, var(--accent) — "Remove" link
```

### Badges

**Bookmark indicator (in chapter list):**
```
text: text-[10px] uppercase tracking-wide
padding: px-2 py-0.5
bg: var(--bg-surface)
border: 1px solid var(--border)
radius: rounded-full
color: var(--text-secondary)
```

### Toasts

**Install prompt:**
```
position: fixed bottom, centered, safe-area-aware
bg: var(--bg-surface)
border: 1px solid var(--border)
shadow: shadow-lg
radius: rounded-2xl (16px)
padding: p-4
max-width: 32rem
```

---

## Iconography

Hand-coded inline SVGs in Feather icon style:

| Attribute | Value |
|-----------|-------|
| Size | 20x20 (display) / 24x24 (viewBox) |
| Stroke | `currentColor`, width 2 |
| Line caps | Round (`strokeLinecap="round"`) |
| Line joins | Round (`strokeLinejoin="round"`) |
| Fill | `none` (unless toggled, e.g., filled bookmark) |

**Icon inventory:**
- Hamburger menu (TOC) — 3 horizontal lines, varying width
- Sun (theme) — circle + radiating lines
- Bookmark — flag shape, fills when active
- Close (X) — two crossing diagonal lines
- Spinner — circular, animated with `animate-spin`

Icons inherit color from their parent via `currentColor`. No icon library — all are inline `<svg>` elements for zero-dependency rendering.

---

## Motion & Transitions

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Top/Bottom bars | `transform` (translateY) | 300ms | default (ease) |
| Side panels | `transform` (translateX) | 300ms | default (ease) |
| Bottom sheet | `transform` (translateY) | 300ms | default (ease) |
| Progress bar | `width` | 300ms | default (ease) |
| Button hover | `background-color`, `color` | 150ms | default (Tailwind `transition-colors`) |

**Principle:** All transitions are simple slides or fades. No bouncing, no spring physics, no choreographed sequences. The UI should move like a sliding door — functional, predictable, fast.

---

## Interaction Model

### Tap Zones (Reader)

- **Center tap** — toggles bottom bar visibility (debounced at 300ms to prevent double-tap)
- **Edge swipe** (left/right 50% of screen width) — chapter navigation. Requires 60px horizontal travel and must be more horizontal than vertical (1.5x ratio)
- **Button/link taps** — pass through, do not trigger UI toggle
- **Text selection** — pass through, do not trigger UI toggle

### Panel Dismissal

All panels dismiss via:
1. Tapping the overlay backdrop
2. (No swipe-to-dismiss or close button — overlay tap is the only method)

### Navigation Model

```
TopBar (always visible):
  [TOC]  [Book Title]  [Theme] [Bookmark]

BottomBar (toggle on tap):
  [Chapter Title]  [Ch X/Y . Z%]  [Font Size]

Reader bottom:
  [<- Previous]  [Next ->]
```

---

## Responsive Behavior

The app is **mobile-first and mobile-only in spirit**. No breakpoints, no desktop-specific layouts.

| Concern | Approach |
|---------|----------|
| Safe areas | `env(safe-area-inset-top/bottom)` via `.safe-area-top/bottom` classes |
| Viewport height | `100dvh` (dynamic viewport height for mobile browsers) |
| Overscroll | `overscroll-behavior: none` (prevents pull-to-refresh) |
| Wake lock | `navigator.wakeLock` to prevent screen sleep during reading |
| Text sizing | `-webkit-text-size-adjust: 100%` to prevent auto-zoom |
| Scrollbar | 4px thin, transparent track, muted thumb |
| Panel max width | `max-w-[80vw]` prevents panels from covering entire screen on tablets |
| Content max width | `max-w-[38em]` keeps line length readable at any screen width |

---

## PWA Configuration

| Property | Value |
|----------|-------|
| Display mode | `standalone` (no browser chrome) |
| Theme color | `#111111` (matches dark theme) |
| Background color | `#111111` |
| Orientation | Any (not locked) |
| Service worker | Auto-update, Workbox |
| EPUB caching | CacheFirst strategy, 30-day expiration, max 5 entries |
| Install prompt | Custom toast UI, dismissible, persists dismissal to localStorage |

---

## Naming Conventions

### CSS Custom Properties
- Prefix: none (short names since they're scoped to `[data-theme]`)
- Pattern: `--{category}-{modifier}` (e.g., `--bg-app`, `--text-primary`)

### localStorage Keys
- Prefix: `sr-` (legacy "shadow reader" prefix)
- Pattern: `sr-{noun}` or `sr-{noun}-{noun}` (e.g., `sr-settings`, `sr-chapter-index`)

### Components
- PascalCase, named by function (e.g., `TopBar`, `ChapterNav`, `SettingsPanel`)
- Panels that slide in are `*Nav`, `*List`, or `*Panel`

### Hooks
- `use{Noun}` pattern (e.g., `useEpubReader`, `useTheme`, `useBookmarks`)
- Each hook owns one concern and its persistence

---

## Anti-Patterns (What This Design System Avoids)

1. **No color for status** — no red/green/blue semantic colors. Errors use text weight/placement instead.
2. **No shadows** (except install toast) — depth is communicated through background color layers, not drop shadows.
3. **No rounded avatars or imagery** — the only visual content is text.
4. **No animations beyond slides** — no fade-in content, no staggered lists, no skeleton loaders (uses a simple spinner).
5. **No modals or dialogs** — everything is a slide-in panel or bottom sheet.
6. **No hover-dependent interactions** — everything works on touch. Hover states exist but are not required.
7. **No decorative elements** — no gradients, patterns, illustrations, or background textures.
8. **No notification badges or counts** — the app is passive, not attention-seeking.

---

## Current Inconsistencies to Address

1. **Inline styles vs Tailwind** — Many components use `style={{ color: "var(--text-primary)" }}` instead of integrating CSS variables into Tailwind's theme config. This could be unified by extending Tailwind v4's `@theme` to map these variables.
2. **TopBar visibility** — `visible` is always passed as `true` in App.tsx, making the prop meaningless. The bar is effectively always shown (sticky), which contradicts the `transform: translateY(-100%)` logic.
3. **Mixed border-radius** — `rounded-lg` (8px), `rounded-xl` (12px), and `rounded-2xl` (16px) are all used without clear rules for when each applies.
4. **Inconsistent padding** — Panels use `p-4` but SettingsPanel uses `px-6`. No clear system for when to use which.
5. **`cursor-pointer`** — Applied inconsistently. Some buttons have it, some don't. Should be a global rule for all interactive elements.

---

## Summary: The Design in One Sentence

A monochromatic, content-first reading environment that uses exactly three background layers, three text weights, and three animation types to create a space where the interface fades away and only the story remains.
