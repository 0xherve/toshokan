import { useState, useEffect } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useBook, useChapters } from "../hooks/useBooks";
import { localDb } from "../lib/localDb";
import type { BookItem } from "../hooks/useBooks";

export function BookDetailPage() {
  const { bookSlug } = useParams({ from: "/books/$bookSlug" });
  const { book, isLoading, error } = useBook(bookSlug);

  return (
    <div className="max-w-[860px] mx-auto px-4 md:px-10 pt-22 pb-20 animate-[fadeIn_0.3s_ease]">
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

function BookContent({ book }: { book: BookItem }) {
  const { chapters, isLoading: chaptersLoading } = useChapters(book.id);
  const [currentCh, setCurrentCh] = useState(0);

  useEffect(() => {
    localDb.readingProgress.get(book.id).then((p) => {
      if (p) setCurrentCh(p.chapterIndex);
    });
  }, [book.id]);

  const progress = book.chapterCount > 0 ? currentCh / book.chapterCount : 0;
  const kanji = book.title.charAt(0);

  return (
    <>
      {/* Book info card */}
      <div className="flex flex-col sm:flex-row gap-6 mb-9 bg-surface rounded-[14px] border border-border p-5 sm:p-7">
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
          <h1 className="font-display text-[1.375rem] md:text-[1.75rem] font-bold leading-[1.2] mb-1.5 tracking-tight">
            {book.title}
          </h1>
          <p className="font-ui text-sm text-foreground-soft mb-3">{book.author}</p>

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

          <Link
            to="/read/$bookId"
            params={{ bookId: book.id }}
            className="cta-primary inline-block font-ui text-sm font-semibold px-[26px] py-2.5 rounded-lg bg-accent text-white tracking-wide"
          >
            {currentCh > 0 ? `Continue Ch. ${currentCh} →` : "Start Reading →"}
          </Link>
        </div>
      </div>

      {/* Synopsis */}
      {book.description && (
        <div className="mb-8">
          <div className="font-ui text-2xs font-semibold text-foreground-muted uppercase tracking-[0.1em] mb-2.5">
            Synopsis
          </div>
          <p className="font-reading text-base leading-[1.75] text-foreground-soft">
            {book.description}
          </p>
        </div>
      )}

      {/* Chapters */}
      <div>
        <div className="font-ui text-2xs font-semibold text-foreground-muted uppercase tracking-[0.1em] mb-2.5">
          Chapters
        </div>
        <div className="bg-surface rounded-[10px] border border-border overflow-hidden">
          {chaptersLoading && (
            <p className="font-ui text-sm text-foreground-muted p-5">Loading chapters...</p>
          )}
          {!chaptersLoading && chapters.length === 0 && (
            <p className="font-ui text-sm text-foreground-muted p-5">No chapters available.</p>
          )}
          {chapters.map((ch) => (
            <Link
              key={ch.index}
              to="/read/$bookId"
              params={{ bookId: book.id }}
              search={{ ch: ch.index }}
              className="chapter-row flex items-center gap-3 px-5 py-3 border-b border-border last:border-b-0"
            >
              <span className="font-ui text-2xs text-foreground-muted font-medium shrink-0 w-8 text-right">
                {ch.index + 1}
              </span>
              <span
                className="font-ui text-sm text-foreground flex-1 min-w-0 truncate"
                style={{
                  color: ch.index < currentCh ? "var(--foreground-muted)" : undefined,
                }}
              >
                {ch.title}
              </span>
              {ch.index === currentCh && currentCh > 0 && (
                <span className="font-ui text-2xs text-accent font-semibold shrink-0">
                  current
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
