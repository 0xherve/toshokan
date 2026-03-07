import { AdminScaffold } from "../components/AdminScaffold";
import { adminUsers } from "../lib/mockData";

export function AdminUsersPage() {
  return (
    <AdminScaffold title="Users" subtitle="Account directory and role management.">
      <div className="divide-y divide-border">
        {adminUsers.map((user) => (
          <div key={user.id} className="py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">{user.email}</p>
              <p className="text-xs mt-0.5 text-secondary">{user.state}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wide text-muted">{user.role}</span>
              <button className="px-2.5 py-1.5 rounded-lg text-xs text-muted hover:text-secondary transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminScaffold>
  );
}
