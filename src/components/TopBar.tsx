interface TopBarProps {
  chapterTitle: string;
  visible: boolean;
  onMenuClick: () => void;
  onBookmarkClick: () => void;
}

export function TopBar({
  chapterTitle,
  visible,
  onMenuClick,
  onBookmarkClick,
}: TopBarProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 safe-area-top transition-transform duration-300"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      <div className="flex items-center justify-between px-4 h-12">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg transition-colors"
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

        <span
          className="text-sm font-medium truncate mx-4 flex-1 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          {chapterTitle}
        </span>

        <button
          onClick={onBookmarkClick}
          className="p-2 -mr-2 rounded-lg transition-colors"
          style={{ color: "var(--text-primary)" }}
          aria-label="Bookmarks"
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
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
