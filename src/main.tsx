import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import { router } from "./router";
import { AuthProvider } from "./lib/auth";

const savedTheme = (() => {
  try {
    const raw = localStorage.getItem("sr-settings");
    if (raw) return JSON.parse(raw).theme;
  } catch {
    /* ignore */
  }
  return "dark";
})();

document.documentElement.setAttribute("data-theme", savedTheme);

registerSW({
  immediate: true,
});

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>,
  );
}
