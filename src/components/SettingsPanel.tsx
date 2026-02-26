import type { ThemeName } from "../lib/constants";
import { MIN_FONT_SIZE, MAX_FONT_SIZE, FONT_SIZE_STEP } from "../lib/constants";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

const themes: { name: ThemeName; label: string; bg: string; fg: string }[] = [
  { name: "light", label: "Light", bg: "#fafaf8", fg: "#1a1a1a" },
  { name: "sepia", label: "Sepia", bg: "#f4ecd8", fg: "#5b4636" },
  { name: "dark", label: "Dark", bg: "#111111", fg: "#d4d4d4" },
];

export function SettingsPanel({
  open,
  onClose,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
}: SettingsPanelProps) {
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
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl safe-area-bottom transition-transform duration-300"
        style={{
          backgroundColor: "var(--bg-surface)",
          transform: open ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: "var(--border)" }}
          />
        </div>

        <div className="px-6 pb-8">
          <div className="mb-6">
            <label
              className="text-xs font-medium uppercase tracking-wider block mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Theme
            </label>
            <div className="flex gap-3">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => onThemeChange(t.name)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: t.bg,
                    color: t.fg,
                    border:
                      theme === t.name
                        ? "2px solid var(--accent)"
                        : "2px solid transparent",
                    boxShadow:
                      theme === t.name ? "0 0 0 1px var(--accent)" : "none",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className="text-xs font-medium uppercase tracking-wider block mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Font Size — {fontSize}px
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  onFontSizeChange(
                    Math.max(MIN_FONT_SIZE, fontSize - FONT_SIZE_STEP),
                  )
                }
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-colors"
                style={{
                  backgroundColor: "var(--bg-app)",
                  color: "var(--text-primary)",
                }}
                disabled={fontSize <= MIN_FONT_SIZE}
              >
                A
                <span className="text-xs">−</span>
              </button>

              <input
                type="range"
                min={MIN_FONT_SIZE}
                max={MAX_FONT_SIZE}
                step={FONT_SIZE_STEP}
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="flex-1 accent-[var(--accent)]"
              />

              <button
                onClick={() =>
                  onFontSizeChange(
                    Math.min(MAX_FONT_SIZE, fontSize + FONT_SIZE_STEP),
                  )
                }
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold transition-colors"
                style={{
                  backgroundColor: "var(--bg-app)",
                  color: "var(--text-primary)",
                }}
                disabled={fontSize >= MAX_FONT_SIZE}
              >
                A
                <span className="text-xs">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
