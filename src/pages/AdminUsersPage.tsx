import { AdminScaffold } from "../components/AdminScaffold";
import { adminUsers } from "../lib/mockData";

export function AdminUsersPage() {
  return (
    <AdminScaffold
      title="Users & Roles"
      subtitle="Manage role grants and account state for reader access."
    >
      <section
        className="rounded-2xl border overflow-hidden"
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
            Account Directory
          </h2>
          <button
            className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-on-primary)",
              border: "1px solid var(--border)",
            }}
          >
            Invite user
          </button>
        </div>

        {adminUsers.map((user, index) => (
          <div
            key={user.id}
            className="px-4 py-4"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderBottom:
                index < adminUsers.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {user.email}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  Status: {user.state}
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
                {user.role}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-app)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                Make admin
              </button>
              <button
                className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-app)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                Suspend
              </button>
            </div>
          </div>
        ))}
      </section>
    </AdminScaffold>
  );
}
