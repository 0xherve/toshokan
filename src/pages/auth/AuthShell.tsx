import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

function LogoMark({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
      <rect width="80" height="80" rx="16" fill="#C45D3E" />
      <path
        d="M24 16 C24 14.3 25.3 13 27 13 L53 13 C54.7 13 56 14.3 56 16 L56 64 L40 52 L24 64 Z"
        fill="#F7F4F0"
      />
    </svg>
  );
}

export function AuthDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
      <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
      <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.6875rem", color: "var(--foreground-muted)" }}>or</span>
      <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
    </div>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
  maxWidth = 400,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  maxWidth?: number;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        backgroundColor: "var(--background)",
      }}
    >
      <div style={{ width: "100%", maxWidth, animation: "fadeIn 0.3s ease" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <Link to="/" style={{ cursor: "pointer", marginBottom: 16, display: "block" }}>
            <LogoMark size={52} />
          </Link>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.625rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 6,
              textAlign: "center",
              color: "var(--foreground)",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.875rem", color: "var(--foreground-muted)", textAlign: "center" }}>
              {subtitle}
            </div>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

