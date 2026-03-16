import { Link } from "@tanstack/react-router";
import { AdminScaffold } from "../components/AdminScaffold";

export function AdminIngestionPage() {
  return (
    <AdminScaffold title="Ingestion" subtitle="EPUB import and processing.">
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-sm font-medium text-foreground mb-1">
          Ingestion is inline
        </p>
        <p className="text-xs text-foreground-muted mb-4">
          EPUB files are parsed and sanitized immediately on upload. There are no
          background jobs or separate queue — chapters are available as soon as the
          upload completes.
        </p>
        <Link
          to="/admin/books"
          className="inline-block font-ui text-sm font-semibold px-5 py-2 rounded-lg bg-accent text-white"
        >
          Upload a book →
        </Link>
      </div>
    </AdminScaffold>
  );
}
