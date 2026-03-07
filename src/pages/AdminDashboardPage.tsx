import { Link } from "@tanstack/react-router";
import { AdminScaffold } from "../components/AdminScaffold";
import { adminMetrics, libraryBooks } from "../lib/mockData";

export function AdminDashboardPage() {
  return (
    <AdminScaffold
      title="Admin Overview"
      subtitle="Live operational summary for reader activity and catalog health."
    >
      <section className="grid gap-3">
        {adminMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-xl border p-4"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {metric.label}
            </p>
            <p className="text-2xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
              {metric.value}
            </p>
          </article>
        ))}
      </section>

      <section
        className="mt-4 rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            Most opened books (7d)
          </h2>
          <Link
            to="/admin/books"
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage books
          </Link>
        </div>

        {libraryBooks.map((book, index) => (
          <div
            key={book.id}
            className="px-4 py-3 flex items-center justify-between gap-3"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderBottom:
                index < libraryBooks.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {book.title}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                {book.author}
              </p>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {Math.round(book.completion * 100)}% avg completion
            </p>
          </div>
        ))}
      </section>
    </AdminScaffold>
  );
}
