import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AdminScaffold } from "../components/AdminScaffold";
import { useBooks } from "../hooks/useBooks";
import { getAdminStats } from "../../server/functions/admin/getAdminStats";

type Stats = Awaited<ReturnType<typeof getAdminStats>>;

export function AdminDashboardPage() {
  const { books, isLoading: booksLoading } = useBooks({ includeUnpublished: true });
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const metrics = stats
    ? [
        { label: "Published books", value: String(stats.books.published) },
        { label: "Draft books", value: String(stats.books.draft) },
        { label: "Archived books", value: String(stats.books.archived) },
        { label: "Total users", value: String(stats.users) },
      ]
    : [];

  return (
    <AdminScaffold title="Overview" subtitle="Operational summary.">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <article
                key={i}
                className="rounded-xl border border-border bg-surface p-4 animate-pulse"
              >
                <div className="h-3 w-24 rounded bg-elevated" />
                <div className="h-7 w-12 rounded bg-elevated mt-2" />
              </article>
            ))
          : metrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <p className="text-xs text-foreground-muted">{metric.label}</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{metric.value}</p>
              </article>
            ))}
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
            Recent books
          </h2>
          <Link
            to="/admin/books"
            className="text-xs text-foreground-muted hover:text-foreground-soft transition-colors"
          >
            All books
          </Link>
        </div>

        {booksLoading && (
          <p className="text-sm text-foreground-muted">Loading...</p>
        )}

        <div className="divide-y divide-border">
          {books.slice(0, 5).map((book) => (
            <div key={book.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{book.title}</p>
                <p className="text-xs mt-0.5 text-foreground-soft">{book.author}</p>
              </div>
              <span className="text-[10px] uppercase tracking-wide text-foreground-muted shrink-0">
                {book.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </AdminScaffold>
  );
}
