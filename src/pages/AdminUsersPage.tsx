import { useEffect, useState } from "react";
import { AdminScaffold } from "../components/AdminScaffold";
import { getUsers } from "../../server/functions/admin/getUsers";

type User = Awaited<ReturnType<typeof getUsers>>[number];

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load users"),
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AdminScaffold title="Users" subtitle="Account directory and role management.">
      {isLoading && <p className="text-sm text-foreground-muted">Loading...</p>}
      {error && <p className="text-sm text-foreground-soft">{error}</p>}

      <div className="divide-y divide-border">
        {users.map((user) => (
          <div key={user.id} className="py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">{user.email}</p>
              <p className="text-xs mt-0.5 text-foreground-soft">{user.name}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wide text-foreground-muted">
              {user.role}
            </span>
          </div>
        ))}
      </div>

      {!isLoading && users.length === 0 && (
        <p className="text-sm text-foreground-muted py-8 text-center">No users yet.</p>
      )}
    </AdminScaffold>
  );
}
