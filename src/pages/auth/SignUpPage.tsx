import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../lib/auth";
import { AuthDivider, AuthShell } from "./AuthShell";

export function SignUpPage() {
  const navigate = useNavigate();
  const { email: activeEmail, signUpWithPassword, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState(activeEmail ?? "");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setMessage("Name required.");
      return;
    }
    if (!email.trim() || !password || password.length < 8) {
      setMessage("Email and password (8+ chars) required.");
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    const error = await signUpWithPassword(name, email, password);
    setIsSubmitting(false);
    if (error) {
      setMessage(error);
      return;
    }
    void navigate({
      to: "/auth/signin",
      search: { message: "Account created. You can sign in now." },
      replace: true,
    });
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    const error = await signInWithGoogle("/library");
    setIsSubmitting(false);
    if (error) setMessage(error);
  };

  return (
    <AuthShell title="Create your library" subtitle="Sign up to start reading on Toshokan">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="oauth-btn" onClick={() => { void handleGoogle(); }} disabled={isSubmitting}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </div>

      <AuthDivider />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", fontWeight: 500, color: "var(--foreground-soft)", display: "block", marginBottom: 6 }}>
            Name
          </label>
          <input className="auth-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Kazuki" />
        </div>

        <div>
          <label style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", fontWeight: 500, color: "var(--foreground-soft)", display: "block", marginBottom: 6 }}>
            Email
          </label>
          <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>

        <div>
          <label style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", fontWeight: 500, color: "var(--foreground-soft)", display: "block", marginBottom: 6 }}>
            Password
          </label>
          <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        <button
          className="cta-primary"
          onClick={() => { void handleSubmit(); }}
          disabled={isSubmitting}
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
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? "…" : "Create Account"}
        </button>
      </div>

      {message && (
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.8125rem", color: "var(--foreground-soft)", marginTop: 14, textAlign: "center" }}>
          {message}
        </p>
      )}

      <div style={{ textAlign: "center", marginTop: 24, fontFamily: "var(--font-ui)", fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>
        Already have an account?{" "}
        <Link to="/auth/signin" className="auth-link">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}

