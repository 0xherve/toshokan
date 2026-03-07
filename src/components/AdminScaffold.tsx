import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { SiteHeader } from "./SiteHeader";
import { useAuth } from "../lib/auth";

interface AdminScaffoldProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const adminNavItems = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/books", label: "Books" },
  { to: "/admin/ingestion", label: "Ingestion" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/audit", label: "Audit" },
] as const;

export function AdminScaffold({ title, subtitle, children }: AdminScaffoldProps) {
  const location = useLocation();
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-dvh" style={{ backgroundColor: "var(--bg-app)" }}>
        <SiteHeader />
        <main className="px-4 py-6 max-w-[36rem] mx-auto">
          <div
            className="rounded-2xl border p-5"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              Loading session
            </h1>
          </div>
        </main>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="min-h-dvh" style={{ backgroundColor: "var(--bg-app)" }}>
        <SiteHeader />
        <main className="px-4 py-6 max-w-[36rem] mx-auto">
          <div
            className="rounded-2xl border p-5"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              Admin access required
            </h1>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
              Sign in with an admin role to manage books, users, and analytics.
            </p>
            <Link
              to="/auth"
              className="inline-block mt-4 px-4 py-2 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-on-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Go to auth
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh" style={{ backgroundColor: "var(--bg-app)" }}>
      <SiteHeader />
      <main className="px-4 py-4 safe-area-bottom max-w-[58rem] mx-auto">
        <section
          className="rounded-2xl border p-4"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <p
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Master Panel
          </p>
          <h1 className="text-lg font-bold mt-1" style={{ color: "var(--text-primary)" }}>
            {title}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {subtitle}
          </p>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {adminNavItems.map((item) => {
              const isActive =
                item.to === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: isActive ? "var(--bg-app)" : "transparent",
                    color: "var(--text-primary)",
                    border: isActive
                      ? "1px solid var(--border)"
                      : "1px solid transparent",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </section>

        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
}
