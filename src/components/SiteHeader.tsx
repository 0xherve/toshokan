import { Link, useLocation } from "@tanstack/react-router";
import { signOut, useDemoSession } from "../lib/demoSession";

export function SiteHeader() {
  const location = useLocation();
  const session = useDemoSession();

  const navItems = [
    { to: "/", label: "Library" },
    { to: "/reader", label: "Reader" },
    ...(session.role === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
  ] as const;

  return (
    <header
      className="sticky top-0 z-40 border-b safe-area-top"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p
              className="text-[10px] uppercase tracking-wide"
              style={{ color: "var(--text-muted)" }}
            >
              Watashi
            </p>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Personal Reading Space
            </p>
          </div>
          {session.role === "guest" ? (
            <Link
              to="/auth"
              className="px-3 py-2 rounded-lg text-xs transition-colors"
              style={{
                backgroundColor: "var(--bg-app)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Sign in
            </Link>
          ) : (
            <button
              onClick={signOut}
              className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--bg-app)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              Sign out
            </button>
          )}
        </div>

        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: isActive ? "var(--bg-app)" : "transparent",
                  color: "var(--text-primary)",
                  border: isActive ? "1px solid var(--border)" : "1px solid transparent",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
