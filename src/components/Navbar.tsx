import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";

export function Navbar() {
  const location = useLocation();
  const { role, signOut, isLoading } = useAuth();

  const isLoggedIn = role !== "guest";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-10 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">                  
          <span className="font-display text-xl font-bold tracking-tight">Toshokan</span>
          <span className="font-display text-2xs text-foreground-muted tracking-[0.06em]">図書館</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/library"
            className="nav-link font-ui text-[0.8125rem] font-medium"
            style={{ color: location.pathname.startsWith("/library") || location.pathname.startsWith("/books") ? "var(--foreground)" : "var(--foreground-muted)" }}
          >
            Library
          </Link>
          <Link
            to="/about"
            className="nav-link font-ui text-[0.8125rem] font-medium"
            style={{ color: location.pathname === "/about" ? "var(--foreground)" : "var(--foreground-muted)" }}
          >
            About
          </Link>

          {role === "admin" && (
            <Link
              to="/admin"
              className="nav-link font-ui text-[0.8125rem] font-medium"
              style={{ color: location.pathname.startsWith("/admin") ? "var(--foreground)" : "var(--foreground-muted)" }}
            >
              Admin
            </Link>
          )}

          {!isLoggedIn && (
            <Link
              to="/auth/signin"
              className="cta-primary font-ui text-xs font-semibold px-[18px] py-[7px] rounded-[7px] bg-accent text-white tracking-wide"
            >
              Sign In
            </Link>
          )}

          {isLoggedIn && (
            <button
              onClick={() => { void signOut(); }}
              disabled={isLoading}
              className="font-ui text-xs font-medium text-foreground-muted hover:text-foreground-soft transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
