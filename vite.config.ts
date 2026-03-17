import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  envPrefix: ["VITE_"],
  server: {
    port: 3000,
  },
  plugins: [tsconfigPaths(), tanstackStart(), tailwindcss(), cloudflare({
    viteEnvironment: {
      name: "ssr"
    }
  })],
});