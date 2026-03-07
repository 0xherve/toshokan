import type { ThemeName } from "../lib/constants";

interface TopBarProps {
  chapterTitle: string;
  onLibraryClick?: () => void;
  onMenuClick: () => void;
  onBookmarkClick: () => void;
  theme: ThemeName;
  onThemeClick: () => void;
  isBookmarked: boolean;
}

export function TopBar({
  chapterTitle,
  onLibraryClick,
  onMenuClick,
  onBookmarkClick,
  theme,
  onThemeClick,
  isBookmarked,
}: TopBarProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 safe-area-top border-b"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-1">
          {onLibraryClick && (
            <button
              onClick={onLibraryClick}
              className="p-2 -ml-2 rounded-xl transition-colors cursor-pointer"
              style={{ color: "var(--text-primary)" }}
              aria-label="Back to library"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
              </svg>
            </button>
          )}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl transition-colors cursor-pointer"
            style={{ color: "var(--text-primary)" }}
            aria-label="Table of contents"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="15" y2="12" />
              <line x1="3" y1="18" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <span
          className="text-sm font-bold truncate mx-4 flex-1 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          {chapterTitle}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={onThemeClick}
            className="p-2 rounded-xl transition-colors cursor-pointer"
            style={{ color: "var(--text-primary)" }}
            aria-label={`Theme: ${theme}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          </button>
          <button
            onClick={onBookmarkClick}
            className="p-2 -mr-2 rounded-xl transition-colors cursor-pointer"
            style={{ color: "var(--text-primary)" }}
            aria-label="Bookmarks"
            aria-pressed={isBookmarked}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isBookmarked ? "var(--bg-primary)" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
