import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../lib/auth";
import { AuthShell } from "./AuthShell";

export function ForgotPasswordPage() {
  const { email: activeEmail } = useAuth();
  const [email, setEmail] = useState(activeEmail ?? "");
  const [forgotSent, setForgotSent] = useState(false);

  return (
    <AuthShell
      title={forgotSent ? "Check your email" : "Reset your password"}
      subtitle={
        forgotSent
          ? "We've sent a reset link to your email. It may take a minute to arrive."
          : "Enter your email and we'll send you a link to reset your password."
      }
    >
      {!forgotSent && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", fontWeight: 500, color: "var(--foreground-soft)", display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <button
            className="cta-primary"
            onClick={() => setForgotSent(true)}
            style={{
              width: "100%",
              fontFamily: "var(--font-ui)",
              fontSize: "0.875rem",
              fontWeight: 600,
              padding: "12px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "var(--accent)",
              color: "#fff",
              letterSpacing: "0.02em",
              marginTop: 4,
            }}
          >
            Send Reset Link
          </button>
        </div>
      )}

      {forgotSent && (
        <Link
          to="/auth/signin"
          className="cta-primary"
          style={{
            width: "100%",
            display: "block",
            textAlign: "center",
            fontFamily: "var(--font-ui)",
            fontSize: "0.875rem",
            fontWeight: 600,
            padding: "12px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "var(--accent)",
            color: "#fff",
            letterSpacing: "0.02em",
            textDecoration: "none",
          }}
        >
          Back to Sign In
        </Link>
      )}

      <div style={{ textAlign: "center", marginTop: 24, fontFamily: "var(--font-ui)", fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>
        Remember your password?{" "}
        <Link to="/auth/signin" className="auth-link">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}

