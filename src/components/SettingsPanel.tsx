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
          className="fixed inset-0 z-50 bg-overlay"
          onClick={onClose}
        />
      )}

      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl safe-area-bottom bg-surface transition-transform duration-300"
        style={{
          transform: open ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-4 pb-8">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider block mb-3 text-muted">
              Font Size — {fontSize}px
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  onFontSizeChange(
                    Math.max(MIN_FONT_SIZE, fontSize - FONT_SIZE_STEP),
                  )
                }
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-colors bg-app text-foreground"
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
                className="flex-1 accent-accent"
              />

              <button
                onClick={() =>
                  onFontSizeChange(
                    Math.min(MAX_FONT_SIZE, fontSize + FONT_SIZE_STEP),
                  )
                }
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold transition-colors bg-app text-foreground"
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
