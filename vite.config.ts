import { defineConfig } from "vite";
import { nitro } from 'nitro/vite';
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsconfigPaths(),
    tanstackStart(),
    tailwindcss(),
		nitro({
			preset: "vercel",
			vercel: {
				functions: {
					runtime: "nodejs22"
				}
			}
    }),
  ],
});
