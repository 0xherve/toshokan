import { useMemo } from "react";
import type { ChapterData } from "../lib/constants";

interface ChapterNavProps {
  open: boolean;
  onClose: () => void;
  chapters: ChapterData[];
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
        return { index: i, label: `${start}-${end}` };
      }),
    [rangeCount, rangeSize, chapters.length],
  );

  const filteredChapters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return chapters;
    return chapters.filter((chapter, idx) => {
      const chapterNumber = idx + 1;
      if (String(chapterNumber).includes(normalizedQuery)) return true;
      return chapter.title.toLowerCase().includes(normalizedQuery);
    });
  }, [chapters, query]);

  const visibleChapters = useMemo(() => {
    if (query.trim()) return filteredChapters;
    const start = selectedRange * rangeSize;
    const end = Math.min(start + rangeSize, chapters.length);
    return chapters.slice(start, end);
  }, [chapters, selectedRange, rangeSize, filteredChapters, query]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 transition-opacity"
          style={{ backgroundColor: "var(--overlay)" }}
          onClick={onClose}
        />
      )}

      <div
        className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[80vw] transition-transform duration-300 overflow-y-auto safe-area-top safe-area-bottom"
        style={{
          backgroundColor: "var(--bg-surface)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="p-4 pb-2">
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Table of Contents
          </h2>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            {totalChapters} chapters
          </p>
          <div className="mt-3">
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search chapter number or title"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-app)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            />
          </div>
          <div className="mt-2">
            <select
              value={selectedRange}
              onChange={(e) => onRangeChange(Number(e.target.value))}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-app)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              {ranges.map((range) => (
                <option key={range.index} value={range.index}>
                  Chapters {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav className="pb-8">
          {visibleChapters.length === 0 ? (
            <div
              className="px-4 py-6 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No chapters found.
            </div>
          ) : (
            visibleChapters.map((chapter, idx) => {
              const chapterIndex = query.trim()
                ? chapters.findIndex((c) => c.index === chapter.index)
                : selectedRange * rangeSize + idx;
              const chapterNumber = chapterIndex + 1;
              const isActive = chapterIndex === currentChapter;
              return (
                <button
                  key={`${chapter.href}-${chapterIndex}`}
                  onClick={() => {
                    onSelectChapter(chapterIndex);
                    onClose();
                  }}
                  className="w-full text-left px-4 py-3 text-sm transition-colors block cursor-pointer"
                  style={{
                    color: "var(--text-primary)",
                    backgroundColor: isActive ? "var(--bg-app)" : "transparent",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  Chapter {chapterNumber}
                </button>
              );
            })
          )}
        </nav>
      </div>
    </>
  );
}
