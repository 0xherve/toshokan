import { Link } from "@tanstack/react-router";
import { AdminScaffold } from "../components/AdminScaffold";
import { adminMetrics, libraryBooks } from "../lib/mockData";

export function AdminDashboardPage() {
  return (
    <AdminScaffold title="Overview" subtitle="Operational summary.">
      <section className="grid grid-cols-2 gap-3">
        {adminMetrics.map((metric) => (
          <article key={metric.label} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-foreground-muted">{metric.label}</p>
            <p className="text-2xl font-bold mt-1 text-foreground">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-muted">Most opened (7d)</h2>
          <Link to="/admin/books" className="text-xs text-foreground-muted hover:text-foreground-soft transition-colors">
            All books
          </Link>
        </div>

        <div className="divide-y divide-border">
          {libraryBooks.map((book) => (
            <div key={book.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{book.title}</p>
                <p className="text-xs mt-0.5 text-foreground-soft">{book.author}</p>
              </div>
              <p className="text-xs text-foreground-muted shrink-0">
                {Math.round(book.completion * 100)}%
              </p>
            </div>
          ))}
        </div>
      </section>
    </AdminScaffold>
  );
}
