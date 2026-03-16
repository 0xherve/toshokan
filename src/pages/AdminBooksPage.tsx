import { useState } from "react";
import { AdminScaffold } from "../components/AdminScaffold";
import { useBooks, type BookStatus } from "../hooks/useBooks";

export function AdminBooksPage() {
  const { books, isLoading, error, uploadBook } = useBooks({ includeUnpublished: true });
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<BookStatus>("draft");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) { setMessage("Select an EPUB file."); return; }
    if (!title.trim()) { setMessage("Title required."); return; }

    setIsUploading(true);
    const err = await uploadBook({ title, author, status, file });
    setIsUploading(false);

    if (err) { setMessage(err); return; }

    setMessage("Uploaded successfully.");
    setTitle(""); setAuthor(""); setStatus("draft"); setFile(null);
  };

  const inputClass = "w-full rounded-lg px-3 py-2 text-sm outline-none bg-background text-foreground border border-border placeholder:text-foreground-muted focus:border-accent transition-colors";

  return (
    <AdminScaffold title="Books" subtitle="Upload and manage the catalog.">
      {/* Upload form */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-sm font-bold text-foreground">Upload Book</h2>

        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="book-title" className="text-xs font-medium uppercase tracking-wider block mb-1.5 text-foreground-muted">Title</label>
            <input id="book-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Book title" />
          </div>

          <div>
            <label htmlFor="book-author" className="text-xs font-medium uppercase tracking-wider block mb-1.5 text-foreground-muted">Author</label>
            <input id="book-author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} placeholder="Author name" />
          </div>

          <div>
            <label htmlFor="book-status" className="text-xs font-medium uppercase tracking-wider block mb-1.5 text-foreground-muted">Status</label>
            <select id="book-status" value={status} onChange={(e) => setStatus(e.target.value as BookStatus)} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label htmlFor="book-file" className="text-xs font-medium uppercase tracking-wider block mb-1.5 text-foreground-muted">EPUB File</label>
            <input id="book-file" type="file" accept=".epub,application/epub+zip" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className={inputClass} />
          </div>
        </div>

        <button
          onClick={() => { void handleUpload(); }}
          disabled={isUploading}
          className="mt-4 px-4 py-2.5 rounded-xl text-sm font-medium bg-accent text-white transition-colors disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload & sanitize"}
        </button>

        {message && <p className="text-xs mt-3 text-foreground-soft">{message}</p>}
      </section>

      {/* Catalog */}
      <section className="mt-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-muted mb-3">Catalog</h2>

        {isLoading && <p className="text-sm text-foreground-muted">Loading...</p>}
        {error && <p className="text-sm text-foreground-soft">{error}</p>}

        <div className="divide-y divide-border">
          {books.map((book) => (
            <div key={book.id} className="py-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{book.title}</p>
                <p className="text-xs mt-0.5 text-foreground-soft">{book.author} &middot; {book.chapterCount} ch</p>
              </div>
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-foreground-muted">
                {book.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </AdminScaffold>
  );
}
