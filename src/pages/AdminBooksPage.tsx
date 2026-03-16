import { useState } from "react";
import ePub from "epubjs";
import type Book from "epubjs/types/book";
import type Section from "epubjs/types/section";
import { AdminScaffold } from "../components/AdminScaffold";
import { useBooks, type BookStatus } from "../hooks/useBooks";
import { uploadBook } from "../../server/functions/books/uploadBook";
import { sanitizeHtml } from "../lib/sanitize";

async function extractChapters(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const book = ePub(arrayBuffer);
  const chapters: { chapterIndex: number; title: string; html: string }[] = [];

  try {
    await (book as Book).ready;
    const spineItems: Section[] = (
      book.spine as unknown as { spineItems: Section[] }
    ).spineItems;

    for (const item of spineItems ?? []) {
      try {
        await item.load(book.load.bind(book));
        const rawHtml = item.document?.body?.innerHTML ?? item.output ?? "";
        const html = sanitizeHtml(rawHtml);
        if (!html.trim()) continue;

        const headingMatch = html.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
        const title = headingMatch
          ? headingMatch[1].replace(/<[^>]+>/g, "").trim()
          : `Chapter ${item.index + 1}`;

        chapters.push({ chapterIndex: item.index, title, html });
      } catch {
        // keep ingest moving
      } finally {
        item.unload();
      }
    }
  } finally {
    (book as Book).destroy();
  }

  return chapters;
}

async function encodeFileBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AdminBooksPage() {
  const { books, isLoading, error, refresh } = useBooks({ includeUnpublished: true });
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
    setMessage(null);

    try {
      const [chapters, fileBase64] = await Promise.all([
        extractChapters(file),
        encodeFileBase64(file),
      ]);

      await uploadBook({
        data: { title, author, status, fileName: file.name, fileBase64, chapters },
      });

      await refresh();
      setMessage("Uploaded successfully.");
      setTitle("");
      setAuthor("");
      setStatus("draft");
      setFile(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg px-3 py-2 text-sm outline-none bg-background text-foreground border border-border placeholder:text-foreground-muted focus:border-accent transition-colors";

  return (
    <AdminScaffold title="Books" subtitle="Upload and manage the catalog.">
      {/* Upload form */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-sm font-bold text-foreground">Upload Book</h2>

        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="book-title" className="text-xs font-medium uppercase tracking-wider block mb-1.5 text-foreground-muted">
              Title
            </label>
            <input
              id="book-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Book title"
            />
          </div>

          <div>
            <label htmlFor="book-author" className="text-xs font-medium uppercase tracking-wider block mb-1.5 text-foreground-muted">
              Author
            </label>
            <input
              id="book-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={inputClass}
              placeholder="Author name"
            />
          </div>

          <div>
            <label htmlFor="book-status" className="text-xs font-medium uppercase tracking-wider block mb-1.5 text-foreground-muted">
              Status
            </label>
            <select
              id="book-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as BookStatus)}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label htmlFor="book-file" className="text-xs font-medium uppercase tracking-wider block mb-1.5 text-foreground-muted">
              EPUB File
            </label>
            <input
              id="book-file"
              type="file"
              accept=".epub,application/epub+zip"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className={inputClass}
            />
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
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-muted mb-3">
          Catalog
        </h2>

        {isLoading && <p className="text-sm text-foreground-muted">Loading...</p>}
        {error && <p className="text-sm text-foreground-soft">{error}</p>}

        <div className="divide-y divide-border">
          {books.map((book) => (
            <div key={book.id} className="py-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{book.title}</p>
                <p className="text-xs mt-0.5 text-foreground-soft">
                  {book.author} · {book.chapterCount} ch
                </p>
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
