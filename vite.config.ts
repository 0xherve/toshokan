import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.svg", "favicon.svg", "mask-icon.svg"],
      manifest: {
        name: "Watashi",
        short_name: "Watashi",
        description: "A tasteful, personal light novel library",
        theme_color: "#111111",
        background_color: "#111111",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
            {
              src: "/logo.svg",
              sizes: "any",
              type: "image/svg+xml",
            },
          {
            src: "/mask-icon.svg",
            sizes: "128x128",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\.epub$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "epub-cache",
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
});
