import { Link } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { useAuth } from "../lib/auth";
import { useBooks } from "../hooks/useBooks";

const statusLabels = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
} as const;

export function LibraryPage() {
  const { role, email } = useAuth();
  const { books, isLoading, error } = useBooks();
  const currentBook = books[0];

  return (
    <div className="min-h-dvh" style={{ backgroundColor: "var(--bg-app)" }}>
      <SiteHeader />

      <main className="px-4 py-4 safe-area-bottom max-w-[48rem] mx-auto">
        <section
          className="rounded-2xl border p-4"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <p
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Continue Reading
          </p>
          <h1 className="text-lg font-bold mt-1" style={{ color: "var(--text-primary)" }}>
            {currentBook?.title ?? "No active book"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {currentBook
              ? `${currentBook.chapterCount} chapters available`
              : "Upload or add a book from the admin panel"}
          </p>
          <div className="mt-4 h-1 rounded-full" style={{ backgroundColor: "var(--border)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: "67%", backgroundColor: "var(--text-primary)" }}
            />
          </div>
          <div className="mt-4 flex gap-3">
            {currentBook ? (
              <Link
                to="/reader/$bookId"
                params={{ bookId: currentBook.id }}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-on-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                Open reader
              </Link>
            ) : (
              <Link
                to="/admin/books"
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-on-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                Add first book
              </Link>
            )}
            {role === "guest" ? (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-xl text-sm transition-colors"
                style={{
                  backgroundColor: "var(--bg-app)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                Sign in to sync
              </Link>
            ) : (
              <p className="text-xs self-center" style={{ color: "var(--text-muted)" }}>
                Sync enabled for {email}
              </p>
            )}
          </div>
        </section>

        <section className="mt-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Your Library
            </h2>
            <button
              className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Add book
            </button>
          </div>

          <div
            className="mt-2 rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            {isLoading && (
              <div
                className="p-4 text-sm"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-secondary)",
                }}
              >
                Loading books...
              </div>
            )}
            {error && (
              <div
                className="p-4 text-sm"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-secondary)",
                }}
              >
                {error}
              </div>
            )}
            {!isLoading && books.length === 0 && (
              <div
                className="p-4 text-sm"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-secondary)",
                }}
              >
                No books found yet.
              </div>
            )}
            {books.map((book) => (
              <div
                key={book.id}
                className="p-4 border-b last:border-b-0"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {book.title}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                      {book.author}
                    </p>
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{
                      color: "var(--text-secondary)",
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {statusLabels[book.status]}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {book.chapterCount} chapters . Updated {book.updatedAt}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {Math.round(book.completion * 100)}%
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    to="/reader/$bookId"
                    params={{ bookId: book.id }}
                    className="px-3 py-2 rounded-lg text-xs transition-colors"
                    style={{
                      backgroundColor: "var(--bg-app)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    Read
                  </Link>
                  {role === "admin" && (
                    <Link
                      to="/admin/books"
                      className="px-3 py-2 rounded-lg text-xs transition-colors"
                      style={{
                        backgroundColor: "var(--bg-app)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      Manage
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
