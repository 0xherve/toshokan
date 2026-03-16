export const STORAGE_KEYS = {
  SETTINGS: "sr-settings",
} as const;

export const DEFAULT_FONT_SIZE = 18;
export const MIN_FONT_SIZE = 14;
export const MAX_FONT_SIZE = 28;
export const FONT_SIZE_STEP = 2;

export type ThemeName = "light" | "dark";

export interface Settings {
  theme: ThemeName;
  fontSize: number;
}

export interface ChapterData {
  href: string;
  html: string;
  title: string;
  index: number;
}


export const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  fontSize: DEFAULT_FONT_SIZE,
};
