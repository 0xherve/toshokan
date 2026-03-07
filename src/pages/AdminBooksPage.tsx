import { useState } from "react";
import { AdminScaffold } from "../components/AdminScaffold";
import { useBooks, type BookStatus } from "../hooks/useBooks";

export function AdminBooksPage() {
  const { books, isLoading, error, uploadBook } = useBooks({
    includeUnpublished: true,
  });
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<BookStatus>("draft");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Select an EPUB file first.");
      return;
    }
    if (!title.trim()) {
      setMessage("Title is required.");
      return;
    }

    setIsUploading(true);
    const uploadError = await uploadBook({
      title,
      author,
      status,
      file,
    });
    setIsUploading(false);

    if (uploadError) {
      setMessage(uploadError);
      return;
    }

    setMessage("Book uploaded and sanitized successfully.");
    setTitle("");
    setAuthor("");
    setStatus("draft");
    setFile(null);
  };

  return (
    <AdminScaffold
      title="Books Management"
      subtitle="Upload EPUBs, sanitize chapters at ingestion, and manage publish state."
    >
      <section
        className="rounded-2xl border p-4"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          Upload Book
        </h2>

        <label
          className="text-xs font-medium uppercase tracking-wider block mt-4 mb-2"
          style={{ color: "var(--text-muted)" }}
          htmlFor="book-title"
        >
          Title
        </label>
        <input
          id="book-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg-app)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        />

        <label
          className="text-xs font-medium uppercase tracking-wider block mt-4 mb-2"
          style={{ color: "var(--text-muted)" }}
          htmlFor="book-author"
        >
          Author
        </label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg-app)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        />

        <label
          className="text-xs font-medium uppercase tracking-wider block mt-4 mb-2"
          style={{ color: "var(--text-muted)" }}
          htmlFor="book-status"
        >
          Status
        </label>
        <select
          id="book-status"
          value={status}
          onChange={(event) => setStatus(event.target.value as BookStatus)}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg-app)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <label
          className="text-xs font-medium uppercase tracking-wider block mt-4 mb-2"
          style={{ color: "var(--text-muted)" }}
          htmlFor="book-file"
        >
          EPUB File
        </label>
        <input
          id="book-file"
          type="file"
          accept=".epub,application/epub+zip"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg-app)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        />

        <button
          onClick={() => {
            void handleUpload();
          }}
          disabled={isUploading}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          style={{
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-on-primary)",
            border: "1px solid var(--border)",
          }}
        >
          {isUploading ? "Uploading..." : "Upload and sanitize"}
        </button>

        {message && (
          <p className="text-xs mt-3" style={{ color: "var(--text-secondary)" }}>
            {message}
          </p>
        )}
      </section>

      <section
        className="mt-4 rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="px-4 py-3 border-b"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            Catalog
          </h2>
        </div>

        {isLoading && (
          <div
            className="px-4 py-4 text-sm"
            style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
          >
            Loading books...
          </div>
        )}
        {error && (
          <div
            className="px-4 py-4 text-sm"
            style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
          >
            {error}
          </div>
        )}
        {!isLoading &&
          books.map((book, index) => (
            <div
              key={book.id}
              className="px-4 py-4"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderBottom:
                  index < books.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {book.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    {book.author} . {book.chapterCount} chapters
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
                  {book.status}
                </span>
              </div>
            </div>
          ))}
      </section>
    </AdminScaffold>
  );
}
