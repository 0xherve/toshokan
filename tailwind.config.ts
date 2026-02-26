import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] as const,
  theme: {
    extend: {},
  },
  plugins: [typography],
} satisfies Config;
