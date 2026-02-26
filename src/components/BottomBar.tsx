interface BottomBarProps {
  visible: boolean;
  chapterTitle: string;
  chapterIndex: number;
  totalChapters: number;
  bookProgress: number;
  onSettingsClick: () => void;
}

export function BottomBar({
  visible,
  chapterTitle,
  chapterIndex,
  totalChapters,
  bookProgress,
  onSettingsClick,
}: BottomBarProps) {
  const progressPercent = Math.round(bookProgress * 100);

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
            backgroundColor: "var(--accent)",
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
          className="p-2 -mr-2 rounded-lg transition-colors"
          style={{ color: "var(--text-primary)" }}
          aria-label="Settings"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      </div>
    </div>
  );
}
