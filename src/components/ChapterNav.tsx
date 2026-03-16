import { useMemo } from "react";
import type { ChapterData } from "../lib/constants";
import type { Bookmark } from "../hooks/useBookmarks";

interface ChapterNavProps {
  open: boolean;
  onClose: () => void;
  chapters: ChapterData[];
  bookmarks: Bookmark[];
  currentChapter: number;
  totalChapters: number;
  onSelectChapter: (index: number) => void;
  query: string;
  onQueryChange: (value: string) => void;
  rangeSize?: number;
  selectedRange: number;
  onRangeChange: (rangeIndex: number) => void;
}

export function ChapterNav({
  open,
  onClose,
  chapters,
  bookmarks,
  currentChapter,
  totalChapters,
  onSelectChapter,
  query,
  onQueryChange,
  rangeSize = 100,
  selectedRange,
  onRangeChange,
}: ChapterNavProps) {
  const rangeCount = Math.max(1, Math.ceil(chapters.length / rangeSize));

  const ranges = useMemo(
    () =>
      Array.from({ length: rangeCount }, (_, i) => {
        const start = i * rangeSize + 1;
        const end = Math.min((i + 1) * rangeSize, chapters.length);
        return { index: i, label: `${start}\u2013${end}` };
      }),
    [rangeCount, rangeSize, chapters.length],
  );

  const filteredChapters = useMemo(() => {
    const normalize = (v: string) =>
      v.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
    const q = normalize(query);
    if (!q) return chapters;
    return chapters.filter((ch, idx) => {
      if (String(idx + 1).includes(q)) return true;
      return normalize(ch.title).includes(q);
    });
  }, [chapters, query]);

  const visibleChapters = useMemo(() => {
    if (query.trim()) return filteredChapters;
    const start = selectedRange * rangeSize;
    const end = Math.min(start + rangeSize, chapters.length);
    return chapters.slice(start, end);
  }, [chapters, selectedRange, rangeSize, filteredChapters, query]);

  const bookmarkedSet = useMemo(
    () => new Set(bookmarks.map((bm) => bm.chapterIndex)),
    [bookmarks],
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 dark:bg-black/60" onClick={onClose} />
      )}

      <div
        className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[80vw] transition-transform duration-300 overflow-y-auto safe-area-top safe-area-bottom bg-surface"
        style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}
      >
        <div className="p-4 pb-2">
          <h2 className="text-lg font-bold text-foreground font-display">Chapters</h2>
          <p className="text-xs mt-1 text-foreground-muted font-ui">{totalChapters} total</p>

          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search chapters..."
            className="mt-3 w-full rounded-lg px-3 py-2 text-sm outline-none font-ui bg-background text-foreground border border-border placeholder:text-foreground-muted"
          />

          {rangeCount > 1 && (
            <select
              value={selectedRange}
              onChange={(e) => onRangeChange(Number(e.target.value))}
              className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none font-ui bg-background text-foreground border border-border"
            >
              {ranges.map((r) => (
                <option key={r.index} value={r.index}>
                  {r.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <nav className="pb-8 font-ui">
          {visibleChapters.length === 0 ? (
            <div className="px-4 py-6 text-sm text-foreground-muted">No chapters found.</div>
          ) : (
            visibleChapters.map((chapter, idx) => {
              const chapterIndex = query.trim()
                ? chapters.findIndex((c) => c.index === chapter.index)
                : selectedRange * rangeSize + idx;
              const isActive = chapterIndex === currentChapter;
              const isBookmarked = bookmarkedSet.has(chapterIndex);

              return (
                <button
                  key={`${chapter.href}-${chapterIndex}`}
                  onClick={() => {
                    onSelectChapter(chapterIndex);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors block ${
                    isActive
                      ? "bg-background text-foreground font-semibold"
                      : "text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{chapterIndex + 1}. {chapter.title}</span>
                    {isBookmarked && (
                      <span className="shrink-0 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full text-foreground-muted bg-background border border-border">
                        saved
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </nav>
      </div>
    </>
  );
}
