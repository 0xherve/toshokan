import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";

export function SiteHeader() {
  const location = useLocation();
  const { role, signOut, isLoading } = useAuth();

  const navItems = [
    { to: "/", label: "Library" },
    { to: "/reader", label: "Reader" },
    ...(role === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface safe-area-top">
      <div className="flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-foreground tracking-tight">
            Watashi
          </span>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    isActive
                      ? "bg-app text-foreground font-medium"
                      : "text-muted hover:text-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {role === "guest" ? (
          <Link
            to="/auth"
            className="px-3 py-1.5 rounded-lg text-xs text-muted hover:text-secondary transition-colors"
          >
            Sign in
          </Link>
        ) : (
          <button
            onClick={() => { void signOut(); }}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg text-xs text-muted hover:text-secondary transition-colors"
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  );
}
