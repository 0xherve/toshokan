import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";

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

  return (
    <main className="px-4 py-20 safe-area-bottom max-w-5xl mx-auto">
      <div className="pb-4 border-b border-border">
        <p className="text-[10px] uppercase tracking-widest text-foreground-muted">Admin</p>
        <h1 className="text-lg font-bold mt-0.5 text-foreground">{title}</h1>
        <p className="text-sm mt-0.5 text-foreground-soft">{subtitle}</p>

        <nav className="mt-3 flex gap-1 overflow-x-auto">
          {adminNavItems.map((item) => {
            const isActive =
              item.to === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-surface text-foreground font-medium"
                    : "text-foreground-muted hover:text-foreground-soft"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-4">{children}</div>
    </main>
  );
}
