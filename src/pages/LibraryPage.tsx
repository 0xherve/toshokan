import { Link } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { useAuth } from "../lib/auth";
import { useBooks } from "../hooks/useBooks";

export function LibraryPage() {
  const { role, email } = useAuth();
  const { books, isLoading, error } = useBooks();
  const currentBook = books[0];

  return (
    <div className="min-h-dvh bg-app">
      <SiteHeader />

      <main className="px-4 py-6 safe-area-bottom max-w-2xl mx-auto">
        {/* Continue reading */}
        {currentBook && (
          <section className="pb-6 border-b border-border">
            <p className="text-[10px] uppercase tracking-widest text-muted">Continue reading</p>
            <h1 className="text-lg font-bold mt-1 text-foreground">{currentBook.title}</h1>
            <p className="text-xs mt-1 text-secondary">
              {currentBook.author} &middot; {currentBook.chapterCount} chapters
            </p>

            <div className="mt-3 h-px bg-border relative">
              <div className="absolute inset-y-0 left-0 bg-foreground" style={{ width: "67%" }} />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/reader/$bookId"
                params={{ bookId: currentBook.id }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-on-primary transition-colors"
              >
                Continue
              </Link>
              {role === "guest" && (
                <Link to="/auth" className="text-xs text-muted hover:text-secondary transition-colors">
                  Sign in to sync
                </Link>
              )}
              {role !== "guest" && (
                <span className="text-xs text-muted">Syncing as {email}</span>
              )}
            </div>
          </section>
        )}

        {!currentBook && !isLoading && (
          <section className="pb-6 border-b border-border">
            <h1 className="text-lg font-bold text-foreground">Your library is empty</h1>
            <p className="text-sm mt-1 text-secondary">Upload a book to get started.</p>
            <Link
              to="/admin/books"
              className="inline-block mt-4 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-on-primary transition-colors"
            >
              Add first book
            </Link>
          </section>
        )}

        {/* Book list */}
        <section className="mt-6">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted">Library</h2>

          {isLoading && (
            <p className="mt-4 text-sm text-muted">Loading...</p>
          )}

          {error && (
            <p className="mt-4 text-sm text-secondary">{error}</p>
          )}

          {!isLoading && books.length === 0 && (
            <p className="mt-4 text-sm text-muted">No books yet.</p>
          )}

          <div className="mt-3 space-y-0 divide-y divide-border">
            {books.map((book) => (
              <div key={book.id} className="py-4 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{book.title}</h3>
                    <p className="text-xs mt-0.5 text-secondary">{book.author}</p>
                  </div>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted">
                    {book.chapterCount} ch
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <Link
                    to="/reader/$bookId"
                    params={{ bookId: book.id }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface text-foreground transition-colors hover:bg-primary hover:text-on-primary"
                  >
                    Read
                  </Link>
                  {role === "admin" && (
                    <Link
                      to="/admin/books"
                      className="px-3 py-1.5 rounded-lg text-xs text-muted hover:text-secondary transition-colors"
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
