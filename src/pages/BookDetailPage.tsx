import { Link, useParams } from "@tanstack/react-router";
import { useBook } from "../hooks/useBooks";

export function BookDetailPage() {
  const { bookSlug } = useParams({ from: "/books/$bookSlug" });
  const { book, isLoading, error } = useBook(bookSlug);

  return (
    <div className="max-w-[860px] mx-auto px-10 pt-22 pb-20 animate-[fadeIn_0.3s_ease]">
      <Link
        to="/library"
        className="back-btn font-ui text-[0.8125rem] font-medium text-foreground-muted inline-flex items-center gap-1.5 mb-5"
      >
        ← Library
      </Link>

      {isLoading && (
        <p className="text-sm text-foreground-muted font-ui mt-8">Loading...</p>
      )}

      {error && <p className="text-sm text-foreground-soft font-ui mt-8">{error}</p>}

      {!isLoading && !book && (
        <div className="text-center py-24 text-foreground-muted font-ui">Book not found.</div>
      )}

      {book && <BookContent book={book} />}
    </div>
  );
}

function BookContent({
  book,
}: {
  book: {
    id: string;
    title: string;
    author: string;
    chapterCount: number;
    completion: number;
    epubUrl: string;
  };
}) {
  const progress = book.completion;
  const currentCh = Math.round(progress * book.chapterCount);
  const kanji = book.title.charAt(0);

  return (
    <>
      {/* Book info card */}
      <div className="flex gap-6 mb-9 bg-surface rounded-[14px] border border-border p-7">
        {/* Cover placeholder */}
        <div
          className="w-[90px] h-[130px] rounded-md shrink-0 flex items-center justify-center font-display text-[2.125rem] text-accent opacity-55 border border-border"
          style={{
            background:
              "linear-gradient(155deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))",
          }}
        >
          {kanji}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-display text-[1.75rem] font-bold leading-[1.2] mb-1.5 tracking-tight">
            {book.title}
          </h1>
          <p className="font-ui text-sm text-foreground-soft mb-3">{book.author}</p>

          {/* Tags */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            <span className="font-ui text-2xs font-medium px-3 py-1 rounded-full bg-elevated text-foreground-muted border border-border">
              {book.chapterCount} chapters
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2.5 mb-4 max-w-[320px]">
            <div className="flex-1 h-[3px] bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-400"
                style={{
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor: progress >= 1 ? "var(--success)" : "var(--accent)",
                }}
              />
            </div>
            <span className="font-ui text-xs text-foreground-muted font-medium">
              Ch. {currentCh}/{book.chapterCount}
            </span>
          </div>

          {/* CTA */}
          {book.epubUrl && (
            <Link
              to="/read/$bookId"
              params={{ bookId: book.id }}
              className="cta-primary inline-block font-ui text-sm font-semibold px-[26px] py-2.5 rounded-lg bg-accent text-white tracking-wide"
            >
              {currentCh > 0 ? `Continue Ch. ${currentCh} →` : "Start Reading →"}
            </Link>
          )}
        </div>
      </div>

      {/* Synopsis */}
      <div className="mb-8">
        <div className="font-ui text-2xs font-semibold text-foreground-muted uppercase tracking-[0.1em] mb-2.5">
          Synopsis
        </div>
        <p className="font-reading text-base leading-[1.75] text-foreground-soft">
          {book.title} by {book.author}.
        </p>
      </div>

      {/* Chapters */}
      <div>
        <div className="font-ui text-2xs font-semibold text-foreground-muted uppercase tracking-[0.1em] mb-2.5">
          Chapters
        </div>
        <div className="bg-surface rounded-[10px] border border-border p-5">
          <p className="font-ui text-sm text-foreground-muted">
            {book.chapterCount} chapters available.
            {book.epubUrl && (
              <>
                {" "}
                <Link
                  to="/read/$bookId"
                  params={{ bookId: book.id }}
                  className="text-accent hover:text-accent-soft transition-colors"
                >
                  Open reader →
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
