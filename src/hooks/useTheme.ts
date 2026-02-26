import { useState, useEffect, useCallback } from "react";
import { getSettings, saveSettings } from "../lib/storage";
import type { ThemeName } from "../lib/constants";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>(() => getSettings().theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
    const settings = getSettings();
    saveSettings({ ...settings, theme: newTheme });
  }, []);

  return { theme, setTheme };
}
