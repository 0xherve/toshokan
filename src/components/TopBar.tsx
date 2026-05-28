import { IconChevronLeft, IconMenu2, IconSun, IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";

interface TopBarProps {
  visible: boolean;
  chapterTitle: string;
  onLibraryClick?: () => void;
  onMenuClick: () => void;
  onBookmarkClick: () => void;
  onThemeClick: () => void;
  isBookmarked: boolean;
}

export function TopBar({
  visible,
  chapterTitle,
  onLibraryClick,
  onMenuClick,
  onBookmarkClick,
  onThemeClick,
  isBookmarked,
}: TopBarProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 safe-area-top border-b border-border bg-surface transition-transform duration-300"
      style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="flex items-center justify-between px-4 h-12 font-ui">
        <div className="flex items-center gap-1">
          {onLibraryClick && (
            <button
              onClick={onLibraryClick}
              className="p-2 -ml-2 rounded-lg transition-colors text-foreground"
              aria-label="Back to library"
            >
              <IconChevronLeft size={20} />
            </button>
          )}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg transition-colors text-foreground"
            aria-label="Table of contents"
          >
            <IconMenu2 size={20} />
          </button>
        </div>

        <span className="text-sm font-bold truncate mx-4 flex-1 text-center text-foreground">
          {chapterTitle}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={onThemeClick}
            className="p-2 rounded-lg transition-colors text-foreground-soft"
            aria-label="Theme"
          >
            <IconSun size={20} />
          </button>
          <button
            onClick={onBookmarkClick}
            className="p-2 -mr-2 rounded-lg transition-colors text-foreground"
            aria-label="Bookmark"
            aria-pressed={isBookmarked}
          >
            {isBookmarked ? <IconBookmarkFilled size={20} /> : <IconBookmark size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
