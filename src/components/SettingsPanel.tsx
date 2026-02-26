import { MIN_FONT_SIZE, MAX_FONT_SIZE, FONT_SIZE_STEP } from "../lib/constants";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export function SettingsPanel({
  open,
  onClose,
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
