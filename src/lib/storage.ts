import { STORAGE_KEYS, DEFAULT_SETTINGS } from "./constants";
import type { Settings, Bookmark } from "./constants";

export function getSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getChapterIndex(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAPTER_INDEX);
    if (raw) return parseInt(raw, 10);
  } catch {
    /* ignore */
  }
  return 0;
}

export function saveChapterIndex(index: number): void {
  localStorage.setItem(STORAGE_KEYS.CHAPTER_INDEX, String(index));
}

export function getScrollPositions(): Record<number, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCROLL_POSITIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {};
}

export function saveScrollPosition(
  chapterIndex: number,
  percent: number,
): void {
  const positions = getScrollPositions();
  positions[chapterIndex] = percent;
  localStorage.setItem(STORAGE_KEYS.SCROLL_POSITIONS, JSON.stringify(positions));
}

export function getBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
}
