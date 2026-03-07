import { AdminScaffold } from "../components/AdminScaffold";
import { libraryBooks } from "../lib/mockData";

export function AdminBooksPage() {
  return (
    <AdminScaffold
      title="Books Management"
      subtitle="Manage publish state, metadata quality, and reader availability."
    >
      <section
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between gap-3"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            Catalog
          </h2>
          <button
            className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-on-primary)",
              border: "1px solid var(--border)",
            }}
          >
            Add new book
          </button>
        </div>

        {libraryBooks.map((book, index) => (
          <div
            key={book.id}
            className="px-4 py-4"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderBottom:
                index < libraryBooks.length - 1 ? "1px solid var(--border)" : "none",
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

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-app)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                Edit metadata
              </button>
              <button
                className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-app)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                Publish
              </button>
              <button
                className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-app)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                Archive
              </button>
            </div>
          </div>
        ))}
      </section>
    </AdminScaffold>
  );
}
