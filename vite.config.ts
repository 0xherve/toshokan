import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  envPrefix: ["VITE_"],
  server: {
    port: 3000,
  },
  plugins: [
    tsconfigPaths(),
    tanstackStart(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.svg", "favicon.svg", "mask-icon.svg"],
      manifest: {
        name: "Toshokan",
        short_name: "Toshokan",
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
