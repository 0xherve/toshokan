interface BottomBarProps {
  visible: boolean;
  chapterTitle: string;
  chapterIndex: number;
  totalChapters: number;
  chapterProgress: number;
  onBookmarksClick?: () => void;
  onSettingsClick: () => void;
}

export function BottomBar({
  visible,
  chapterTitle,
  chapterIndex,
  totalChapters,
  chapterProgress,
  onBookmarksClick,
  onSettingsClick,
}: BottomBarProps) {
  const progressPercent = Math.round(chapterProgress * 100);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom border-t border-border bg-surface transition-transform duration-300"
      style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
    >
      <div className="h-0.5 w-full bg-border">
        <div
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 h-11">
        <span className="text-xs truncate flex-1 text-secondary">
          {chapterTitle}
        </span>

        <span className="text-xs mx-3 whitespace-nowrap text-muted">
          {chapterIndex + 1}/{totalChapters} &middot; {progressPercent}%
        </span>

        <div className="flex items-center gap-1">
          {onBookmarksClick && (
            <button
              onClick={onBookmarksClick}
              className="p-2 rounded-lg transition-colors text-foreground"
              aria-label="Open bookmarks"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          )}
          <button
            onClick={onSettingsClick}
            className="p-2 -mr-2 rounded-lg transition-colors text-foreground"
            aria-label="Font size"
          >
            <span className="text-base font-bold">A</span>
          </button>
        </div>
      </div>
    </div>
  );
}
