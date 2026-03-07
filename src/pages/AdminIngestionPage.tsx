import { AdminScaffold } from "../components/AdminScaffold";
import { ingestionJobs } from "../lib/mockData";

export function AdminIngestionPage() {
  return (
    <AdminScaffold
      title="Ingestion Queue"
      subtitle="Track EPUB import jobs, retries, and parsing failures."
    >
      <section
        className="rounded-2xl border overflow-hidden"
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
            Recent Jobs
          </h2>
        </div>

        {ingestionJobs.map((job, index) => (
          <div
            key={job.id}
            className="px-4 py-4"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderBottom:
                index < ingestionJobs.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {job.bookTitle}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  {job.id} . {job.submittedBy}
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
                {job.status}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Created {job.createdAt}
              </p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-app)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  View logs
                </button>
                <button
                  className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-app)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </AdminScaffold>
  );
}
