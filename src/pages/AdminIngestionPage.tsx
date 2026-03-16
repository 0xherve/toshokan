import { AdminScaffold } from "../components/AdminScaffold";
import { ingestionJobs } from "../lib/mockData";

export function AdminIngestionPage() {
  return (
    <AdminScaffold title="Ingestion" subtitle="EPUB import jobs and parsing status.">
      <div className="divide-y divide-border">
        {ingestionJobs.map((job) => (
          <div key={job.id} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{job.bookTitle}</p>
                <p className="text-xs mt-0.5 text-foreground-soft">{job.submittedBy}</p>
              </div>
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-foreground-muted">{job.status}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-foreground-muted">{job.createdAt}</p>
              <button className="text-xs text-foreground-muted hover:text-foreground-soft transition-colors">Retry</button>
            </div>
          </div>
        ))}
      </div>
    </AdminScaffold>
  );
}
