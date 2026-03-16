import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import { registerSW } from "virtual:pwa-register";
import { DEFAULT_SETTINGS } from "./lib/constants";

const rawSettings = (() => {
  try {
    return localStorage.getItem("sr-settings");
  } catch {
    return null;
  }
})();

const initialTheme = (() => {
  if (!rawSettings) return DEFAULT_SETTINGS.theme;

  try {
    const parsed = JSON.parse(rawSettings) as { theme?: string };
    return parsed.theme ?? DEFAULT_SETTINGS.theme;
  } catch {
    return DEFAULT_SETTINGS.theme;
  }
})();

document.documentElement.className = initialTheme;

registerSW({
  immediate: true,
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
