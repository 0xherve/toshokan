import { Link, useParams } from "@tanstack/react-router";
import App from "../App";
import { useBook } from "../hooks/useBooks";

export function ReaderPage() {
  const { bookId } = useParams({ from: "/reader/$bookId" });
  const { book, isLoading, error } = useBook(bookId);

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6">
        <div
          className="rounded-2xl border p-5 text-sm"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-secondary)",
          }}
        >
          Loading book...
        </div>
      </div>
    );
  }

  if (error || !book?.epubUrl) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6">
        <div
          className="rounded-2xl border p-5 max-w-xl"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Reader unavailable
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            {error ?? "This book has no EPUB URL yet."}
          </p>
          <Link
            to="/admin/books"
            className="inline-block mt-4 px-4 py-2 rounded-xl text-sm"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-on-primary)",
              border: "1px solid var(--border)",
            }}
          >
            Manage books
          </Link>
        </div>
      </div>
    );
  }

  return <App bookId={book.id} epubUrl={book.epubUrl} />;
}
