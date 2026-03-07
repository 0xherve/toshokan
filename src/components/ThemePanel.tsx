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
          className="fixed inset-0 z-50 bg-overlay"
          onClick={onClose}
        />
      )}

      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[80vw] transition-transform duration-300 overflow-y-auto safe-area-top safe-area-bottom bg-surface"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="p-4 pb-2">
          <h2 className="text-lg font-bold text-foreground">
            Theme
          </h2>
          <p className="text-xs mt-1 text-muted">
            Choose a reading theme
          </p>
        </div>

        <div className="px-4 pb-6">
          <div className="grid gap-3">
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => onThemeChange(t.name)}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
                  theme === t.name ? "border-2 border-foreground" : "border border-border"
                }`}
                style={{
                  backgroundColor: t.bg,
                  color: t.fg,
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
