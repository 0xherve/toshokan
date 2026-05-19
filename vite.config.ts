import path from "path"
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@":path.resolve(__dirname, "./src"),
      "@server":path.resolve(__dirname, "./server"),
    }
  },
  plugins: [
    tsconfigPaths(),
    tanstackStart(),
    tailwindcss(),
		cloudflare({
          viteEnvironment: {
            name: "ssr"
          }
        }),
  ],
});