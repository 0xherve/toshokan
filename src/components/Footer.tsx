import { useTheme } from "../hooks/useTheme";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function Footer() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <footer className="bg-background safe-area-bottom">
      <div className="border-t border-border max-w-5xl mx-auto px-4 md:px-10 h-14 flex items-center justify-between">
        <div className="font-ui text-[0.8125rem] font-medium text-foreground-muted">
          Built by <a className="text-foreground hover:underline" href="https://github.com/0xherve" target="_blank">0xherve</a>
        </div>

        <div className="relative flex items-center rounded-full bg-elevated border border-border p-[3px] gap-0">
          <div
            className="absolute rounded-full bg-surface border border-border transition-[left] duration-200 ease-out"
            style={{
              width: 28,
              height: 28,
              top: 3,
              left: isLight ? 3 : 31,
            }}
          />
          <button
            onClick={() => setTheme("light")}
            aria-label="Light theme"
            className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full transition-colors"
            style={{ color: isLight ? "var(--foreground)" : "var(--foreground-muted)" }}
          >
            <IconSun size={14} />
          </button>
          <button
            onClick={() => setTheme("dark")}
            aria-label="Dark theme"
            className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full transition-colors"
            style={{ color: !isLight ? "var(--foreground)" : "var(--foreground-muted)" }}
          >
            <IconMoon size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
