import { AdminScaffold } from "../components/AdminScaffold";
import { auditEvents } from "../lib/mockData";

export function AdminAuditPage() {
  return (
    <AdminScaffold title="Audit Log" subtitle="Admin activity feed.">
      <div className="divide-y divide-border">
        {auditEvents.map((event) => (
          <div key={event.id} className="py-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{event.action}</p>
              <p className="text-xs mt-0.5 text-foreground-soft">{event.actor} &middot; {event.target}</p>
            </div>
            <p className="text-xs text-foreground-muted whitespace-nowrap shrink-0">{event.at}</p>
          </div>
        ))}
      </div>
    </AdminScaffold>
  );
}
