import { IconBookmark } from "@tabler/icons-react";

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
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 h-11 font-ui">
        <span className="text-xs truncate flex-1 text-foreground-soft">
          {chapterTitle}
        </span>

        <span className="text-xs mx-3 whitespace-nowrap text-foreground-muted">
          {chapterIndex + 1}/{totalChapters} &middot; {progressPercent}%
        </span>

        <div className="flex items-center gap-1">
          {onBookmarksClick && (
            <button
              onClick={onBookmarksClick}
              className="p-2 rounded-lg transition-colors text-foreground"
              aria-label="Open bookmarks"
            >
              <IconBookmark size={18} />
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
