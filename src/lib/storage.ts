import { STORAGE_KEYS, DEFAULT_SETTINGS } from "./constants";
import type { Settings, Bookmark } from "./constants";

function hasStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getSettings(): Settings {
  if (!hasStorage()) return DEFAULT_SETTINGS;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
  if (!hasStorage()) return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getChapterIndexForBook(bookId: string): number {
  if (!hasStorage()) return 0;

  try {
    const raw = localStorage.getItem(`sr-chapter-index-${bookId}`);
    if (raw) return parseInt(raw, 10);
  } catch {
    /* ignore */
  }
  return 0;
}

export function saveChapterIndexForBook(bookId: string, index: number): void {
  if (!hasStorage()) return;
  localStorage.setItem(`sr-chapter-index-${bookId}`, String(index));
}

export function getScrollPositionsForBook(bookId: string): Record<number, number> {
  if (!hasStorage()) return {};

  try {
    const raw = localStorage.getItem(`sr-scroll-positions-${bookId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {};
}

export function saveScrollPositionForBook(
  bookId: string,
  chapterIndex: number,
  percent: number,
): void {
  if (!hasStorage()) return;

  const positions = getScrollPositionsForBook(bookId);
  positions[chapterIndex] = percent;
  localStorage.setItem(`sr-scroll-positions-${bookId}`, JSON.stringify(positions));
}

export function getLastBookId(): string | null {
  if (!hasStorage()) return null;
  try {
    return localStorage.getItem("sr-last-book") || null;
  } catch {
    return null;
  }
}

export function saveLastBookId(bookId: string): void {
  if (!hasStorage()) return;
  localStorage.setItem("sr-last-book", bookId);
}

export function getBookmarks(): Bookmark[] {
  if (!hasStorage()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  if (!hasStorage()) return;
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
}
