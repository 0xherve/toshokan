import type { Bookmark } from "../lib/constants";

interface BookmarkListProps {
  open: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onSelectBookmark: (bookmark: Bookmark) => void;
  onRemoveBookmark: (id: string) => void;
}

export function BookmarkList({
  open,
  onClose,
  bookmarks,
  onSelectBookmark,
  onRemoveBookmark,
}: BookmarkListProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-overlay" onClick={onClose} />
      )}

      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[80vw] transition-transform duration-300 overflow-y-auto safe-area-top safe-area-bottom bg-surface"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="p-4 pb-2">
          <h2 className="text-lg font-bold text-foreground">Bookmarks</h2>
          <p className="text-xs mt-1 text-muted">{bookmarks.length} saved</p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted">
            No bookmarks yet.
            <br />
            <span className="text-xs">Tap the bookmark icon to save your place.</span>
          </div>
        ) : (
          <div className="pb-8">
            {bookmarks.map((bm) => (
              <div key={bm.id} className="px-4 py-3 border-b border-border">
                <button
                  onClick={() => { onSelectBookmark(bm); onClose(); }}
                  className="w-full text-left"
                >
                  <div className="text-sm font-medium text-foreground">{bm.chapterTitle}</div>
                  <div className="text-xs mt-1 line-clamp-2 text-secondary">{bm.excerpt}</div>
                  <div className="text-xs mt-1 text-muted">
                    {Math.round(bm.scrollPercent * 100)}% through chapter
                  </div>
                </button>
                <button
                  onClick={() => onRemoveBookmark(bm.id)}
                  className="text-xs mt-1 transition-colors text-muted hover:text-foreground"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
