import { AdminScaffold } from "../components/AdminScaffold";

export function AdminAuditPage() {
  return (
    <AdminScaffold title="Audit Log" subtitle="Admin activity feed.">
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-sm font-medium text-foreground mb-1">Not yet configured</p>
        <p className="text-xs text-foreground-muted">
          Audit logging will be added in a future update.
        </p>
      </div>
    </AdminScaffold>
  );
}
