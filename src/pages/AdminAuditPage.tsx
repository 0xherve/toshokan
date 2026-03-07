import { AdminScaffold } from "../components/AdminScaffold";
import { auditEvents } from "../lib/mockData";

export function AdminAuditPage() {
  return (
    <AdminScaffold
      title="Audit Log"
      subtitle="Immutable admin activity feed for governance and incident tracing."
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
            Recent Admin Actions
          </h2>
        </div>

        {auditEvents.map((event, index) => (
          <div
            key={event.id}
            className="px-4 py-4"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderBottom:
                index < auditEvents.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {event.action}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  {event.actor}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {event.target}
                </p>
              </div>
              <p className="text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                {event.at}
              </p>
            </div>
          </div>
        ))}
      </section>
    </AdminScaffold>
  );
}
