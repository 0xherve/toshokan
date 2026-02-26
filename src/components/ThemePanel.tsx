import type { ThemeName } from "../lib/constants";

interface ThemePanelProps {
  open: boolean;
  onClose: () => void;
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const themes: { name: ThemeName; label: string; bg: string; fg: string }[] = [
  { name: "light", label: "Light", bg: "#fafaf8", fg: "#1a1a1a" },
  { name: "sepia", label: "Sepia", bg: "#f4ecd8", fg: "#5b4636" },
  { name: "dark", label: "Dark", bg: "#111111", fg: "#d4d4d4" },
];

export function ThemePanel({
  open,
  onClose,
  theme,
  onThemeChange,
}: ThemePanelProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50"
          style={{ backgroundColor: "var(--overlay)" }}
          onClick={onClose}
        />
      )}

      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[80vw] transition-transform duration-300 overflow-y-auto safe-area-top safe-area-bottom"
        style={{
          backgroundColor: "var(--bg-surface)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="p-4 pb-2">
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Theme
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Choose a reading theme
          </p>
        </div>

        <div className="px-4 pb-6">
          <div className="grid gap-3">
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => onThemeChange(t.name)}
                className="w-full py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
                style={{
                  backgroundColor: t.bg,
                  color: t.fg,
                  border:
                    theme === t.name
                      ? "2px solid var(--text-primary)"
                      : "1px solid var(--border)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
