import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";
import { useBooks } from "../hooks/useBooks";
import { localDb } from "../lib/localDb";
import { getLastBookId, saveLastBookId } from "../lib/storage";

function useLocalCompletion(bookIds: string[]) {
  const [completion, setCompletion] = useState<Record<string, number>>({});

  useEffect(() => {
    if (bookIds.length === 0) return;
    localDb.readingProgress
      .where("bookId")
      .anyOf(bookIds)
      .toArray()
      .then((rows) => {
        const map: Record<string, number> = {};
        for (const row of rows) {
          map[row.bookId] = row.chapterIndex;
        }
        setCompletion(map);
      })
      .catch(() => {});
  }, [bookIds.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return completion;
}

export function LibraryPage() {
  const { role, email } = useAuth();
  const { books, isLoading, error } = useBooks();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const bookIds = books.map((b) => b.id);
  const chaptersRead = useLocalCompletion(bookIds);

  function getCompletion(bookId: string, chapterCount: number) {
    if (chapterCount === 0) return 0;
    return (chaptersRead[bookId] ?? 0) / chapterCount;
  }

  const lastBookId = getLastBookId();
  const currentBook =
    (lastBookId ? books.find((b) => b.id === lastBookId) : null) ?? books[0];

  const filtered = books.filter((b) => {
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const completion = getCompletion(b.id, b.chapterCount);
    if (filter === "completed") return matchSearch && completion >= 1;
    if (filter === "reading") return matchSearch && completion < 1 && completion > 0;
    return matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-10 pt-22 pb-20 animate-[fadeIn_0.3s_ease]">
      <h1 className="font-display text-[1.5rem] md:text-[2rem] font-bold tracking-tight mb-7">
        Your Library
      </h1>

      {/* Continue reading card */}
      {currentBook && (
        <Link
          to="/books/$bookSlug"
          params={{ bookSlug: currentBook.id }}
          onClick={() => saveLastBookId(currentBook.id)}
          className="book-card flex gap-[18px] items-center bg-surface rounded-xl border border-border shadow-sm px-4 py-4 md:px-[26px] md:py-[22px] mb-7"
        >
          <div
            className="w-[52px] h-[75px] rounded-md shrink-0 flex items-center justify-center font-display text-xl text-accent opacity-55 border border-border"
            style={{
              background:
                "linear-gradient(155deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))",
            }}
          >
            {currentBook.title.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-ui text-3xs font-semibold text-foreground-muted uppercase tracking-[0.08em] mb-0.5">
              Continue Reading
            </div>
            <div className="font-display text-lg font-semibold tracking-tight">
              {currentBook.title}
            </div>
            <div className="font-ui text-xs text-foreground-muted">
              Ch. {chaptersRead[currentBook.id] ?? 0} of{" "}
              {currentBook.chapterCount} · {currentBook.author}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 min-w-[90px]">
            <span className="font-ui text-xs font-semibold text-accent">
              {Math.round(getCompletion(currentBook.id, currentBook.chapterCount) * 100)}%
            </span>
            <div className="w-[90px] h-[2.5px] bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.round(getCompletion(currentBook.id, currentBook.chapterCount) * 100)}%`,
                  backgroundColor:
                    getCompletion(currentBook.id, currentBook.chapterCount) >= 1
                      ? "var(--success)"
                      : "var(--accent)",
                }}
              />
            </div>
          </div>
        </Link>
      )}

      {!currentBook && !isLoading && (
        <div className="bg-surface rounded-xl border border-border shadow-sm px-[26px] py-[22px] mb-7">
          <h2 className="font-display text-lg font-bold text-foreground">
            Your library is empty
          </h2>
          <p className="text-sm mt-1 text-foreground-soft font-reading">
            Upload a book to get started.
          </p>
          {role === "admin" && (
            <Link
              to="/admin/books"
              className="cta-primary inline-block mt-4 font-ui text-sm font-semibold px-6 py-2.5 rounded-lg bg-accent text-white"
            >
              Add first book
            </Link>
          )}
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search library..."
          className="flex-1 font-ui text-[0.8125rem] px-4 py-2.5 rounded-lg border border-border bg-background text-foreground outline-none focus:border-accent transition-colors"
        />
        <div className="flex gap-1">
          {([["all", "All"], ["reading", "Reading"], ["completed", "Done"]] as const).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="font-ui text-xs px-3.5 py-[7px] rounded-full border-none"
                style={{
                  fontWeight: filter === key ? 600 : 400,
                  backgroundColor:
                    filter === key
                      ? "color-mix(in srgb, var(--accent) 10%, transparent)"
                      : "transparent",
                  color: filter === key ? "var(--accent)" : "var(--foreground-muted)",
                }}
              >
                {label}
              </button>
            ),
          )}
        </div>
      </div>

      {isLoading && (
        <p className="mt-4 text-sm text-foreground-muted font-ui">Loading...</p>
      )}
      {error && <p className="mt-4 text-sm text-foreground-soft font-ui">{error}</p>}

      {/* Book grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {filtered.map((book, i) => {
          const completion = getCompletion(book.id, book.chapterCount);
          return (
            <Link
              key={book.id}
              to="/books/$bookSlug"
              params={{ bookSlug: book.id }}
              className="book-card bg-surface rounded-[10px] border border-border p-[18px_20px] flex gap-4 animate-[slideUp_0.3s_ease_both]"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div
                className="w-[60px] h-[87px] rounded-md shrink-0 flex items-center justify-center font-display text-[1.4rem] text-accent opacity-55 border border-border"
                style={{
                  background:
                    "linear-gradient(155deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))",
                }}
              >
                {book.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-base font-semibold leading-snug mb-0.5">
                  {book.title}
                </div>
                <div className="font-ui text-xs text-foreground-muted mb-1">
                  {book.author}
                </div>
                <div className="flex gap-1 mb-2.5 flex-wrap">
                  <span className="font-ui text-3xs px-2 py-0.5 rounded-full bg-elevated text-foreground-muted">
                    {book.chapterCount} ch
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[2.5px] bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-400"
                      style={{
                        width: `${Math.round(completion * 100)}%`,
                        backgroundColor:
                          completion >= 1 ? "var(--success)" : "var(--accent)",
                      }}
                    />
                  </div>
                  <span className="font-ui text-3xs text-foreground-muted font-medium shrink-0">
                    {completion >= 1 ? "✓" : `${Math.round(completion * 100)}%`}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {!isLoading && filtered.length === 0 && books.length > 0 && (
        <div className="text-center py-16 font-ui text-[0.9375rem] text-foreground-muted">
          No books found.
        </div>
      )}

      {role === "guest" && (
        <div className="mt-8 text-center">
          <Link
            to="/auth/signin"
            className="text-xs text-foreground-muted hover:text-foreground-soft transition-colors font-ui"
          >
            Sign in to sync your progress
          </Link>
        </div>
      )}
      {role !== "guest" && (
        <div className="mt-8 text-center">
          <span className="text-xs text-foreground-muted font-ui">
            Syncing as {email}
          </span>
        </div>
      )}
    </div>
  );
}
