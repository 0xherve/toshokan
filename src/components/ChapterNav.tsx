import type { TocItem } from "../lib/constants";

interface ChapterNavProps {
  open: boolean;
  onClose: () => void;
  toc: TocItem[];
  currentChapter: number;
  totalChapters: number;
  onSelectChapter: (index: number) => void;
}

export function ChapterNav({
  open,
  onClose,
  toc,
  currentChapter,
  totalChapters,
  onSelectChapter,
}: ChapterNavProps) {
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
        </div>

        <nav className="pb-8">
          {toc.length > 0 ? (
            toc.map((item) => (
              <button
                key={item.href + item.spineIndex}
                onClick={() => {
                  onSelectChapter(item.spineIndex);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 text-sm transition-colors block"
                style={{
                  color:
                    item.spineIndex === currentChapter
                      ? "var(--accent)"
                      : "var(--text-primary)",
                  backgroundColor:
                    item.spineIndex === currentChapter
                      ? "var(--bg-app)"
                      : "transparent",
                  fontWeight: item.spineIndex === currentChapter ? 600 : 400,
                }}
              >
                {item.label}
              </button>
            ))
          ) : (
            Array.from({ length: totalChapters }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelectChapter(i);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 text-sm transition-colors block"
                style={{
                  color:
                    i === currentChapter ? "var(--accent)" : "var(--text-primary)",
                  backgroundColor:
                    i === currentChapter ? "var(--bg-app)" : "transparent",
                  fontWeight: i === currentChapter ? 600 : 400,
                }}
              >
                Chapter {i + 1}
              </button>
            ))
          )}
        </nav>
      </div>
    </>
  );
}
