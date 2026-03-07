import { Link, useParams } from "@tanstack/react-router";
import App from "../App";
import { useBook } from "../hooks/useBooks";

export function ReaderPage() {
  const { bookId } = useParams({ from: "/reader/$bookId" });
  const { book, isLoading, error } = useBook(bookId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-app">
        <span className="text-sm text-muted">Loading book...</span>
      </div>
    );
  }

  if (error || !book?.epubUrl) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-app px-6">
        <div className="max-w-sm text-center">
          <h1 className="text-lg font-bold text-foreground">Unavailable</h1>
          <p className="text-sm mt-2 text-secondary">
            {error ?? "This book has no EPUB file yet."}
          </p>
          <Link
            to="/"
            className="inline-block mt-4 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-on-primary transition-colors"
          >
            Back to library
          </Link>
        </div>
      </div>
    );
  }

  return <App bookId={book.id} epubUrl={book.epubUrl} />;
}
