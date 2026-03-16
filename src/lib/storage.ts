import { STORAGE_KEYS, DEFAULT_SETTINGS } from "./constants";
import type { Settings } from "./constants";

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
