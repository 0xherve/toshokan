interface BottomBarProps {
  visible: boolean;
  chapterTitle: string;
  chapterIndex: number;
  totalChapters: number;
  chapterProgress: number;
  onSettingsClick: () => void;
}

export function BottomBar({
  visible,
  chapterTitle,
  chapterIndex,
  totalChapters,
  chapterProgress,
  onSettingsClick,
}: BottomBarProps) {
  const progressPercent = Math.round(chapterProgress * 100);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom transition-transform duration-300"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        transform: visible ? "translateY(0)" : "translateY(100%)",
      }}
    >
      <div className="h-0.5 w-full" style={{ backgroundColor: "var(--border)" }}>
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: "var(--text-primary)",
          }}
        />
      </div>

      <div className="flex items-center justify-between px-4 h-11">
        <span
          className="text-xs truncate flex-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {chapterTitle}
        </span>

        <span
          className="text-xs mx-3 whitespace-nowrap"
          style={{ color: "var(--text-muted)" }}
        >
          {chapterIndex + 1}/{totalChapters} &middot; {progressPercent}%
        </span>

        <button
          onClick={onSettingsClick}
          className="p-2 -mr-2 rounded-lg transition-colors cursor-pointer"
          style={{ color: "var(--text-primary)" }}
          aria-label="Font size"
        >
          <span className="text-base font-bold">A</span>
        </button>
      </div>
    </div>
  );
}
