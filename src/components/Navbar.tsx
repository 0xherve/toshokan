import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";

export function Navbar() {
  const location = useLocation();
  const { role, signOut, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = role !== "guest";

  const navLinkClass = "nav-link font-ui text-[0.8125rem] font-medium";

  function navColor(active: boolean) {
    return active ? "var(--foreground)" : "var(--foreground-muted)";
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-4 md:px-10 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold tracking-tight">Toshokan</span>
          <span className="font-display text-2xs text-foreground-muted tracking-[0.06em]">図書館</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/library"
            className={navLinkClass}
            style={{ color: navColor(location.pathname.startsWith("/library") || location.pathname.startsWith("/books")) }}
          >
            Library
          </Link>
          <Link
            to="/about"
            className={navLinkClass}
            style={{ color: navColor(location.pathname === "/about") }}
          >
            About
          </Link>

          {role === "admin" && (
            <Link
              to="/admin"
              className={navLinkClass}
              style={{ color: navColor(location.pathname.startsWith("/admin")) }}
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

        {/* Mobile: sign in + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {!isLoggedIn && (
            <Link
              to="/auth/signin"
              className="cta-primary font-ui text-xs font-semibold px-[18px] py-[7px] rounded-[7px] bg-accent text-white tracking-wide"
            >
              Sign In
            </Link>
          )}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-foreground-muted hover:text-foreground transition-colors"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="5" y1="5" x2="15" y2="15" />
                <line x1="15" y1="5" x2="5" y2="15" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-3">
          <Link
            to="/library"
            onClick={() => setMenuOpen(false)}
            className={navLinkClass}
            style={{ color: navColor(location.pathname.startsWith("/library") || location.pathname.startsWith("/books")) }}
          >
            Library
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className={navLinkClass}
            style={{ color: navColor(location.pathname === "/about") }}
          >
            About
          </Link>

          {role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
              style={{ color: navColor(location.pathname.startsWith("/admin")) }}
            >
              Admin
            </Link>
          )}

          {isLoggedIn && (
            <button
              onClick={() => { setMenuOpen(false); void signOut(); }}
              disabled={isLoading}
              className="font-ui text-xs font-medium text-foreground-muted hover:text-foreground-soft transition-colors text-left"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
