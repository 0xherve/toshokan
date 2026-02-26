export const EPUB_URL =
  import.meta.env.VITE_EPUB_URL ||
  "https://r11ytcy7ss0omh5m.public.blob.vercel-storage.com/shadow-slave.epub";

export const STORAGE_KEYS = {
  CHAPTER_INDEX: "sr-chapter-index",
  SCROLL_POSITIONS: "sr-scroll-positions",
  SETTINGS: "sr-settings",
  BOOKMARKS: "sr-bookmarks",
} as const;

export const DEFAULT_FONT_SIZE = 18;
export const MIN_FONT_SIZE = 14;
export const MAX_FONT_SIZE = 28;
export const FONT_SIZE_STEP = 2;

export type ThemeName = "light" | "sepia" | "dark";

export interface Settings {
  theme: ThemeName;
  fontSize: number;
}

export interface Bookmark {
  id: string;
  chapterIndex: number;
  chapterTitle: string;
  scrollPercent: number;
  excerpt: string;
  createdAt: number;
}

export interface ChapterData {
  href: string;
  html: string;
  title: string;
  index: number;
}

export interface TocItem {
  label: string;
  href: string;
  spineIndex: number;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  fontSize: DEFAULT_FONT_SIZE,
};
