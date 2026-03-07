import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { useAuth } from "../lib/auth";

type AuthMode = "sign-in" | "sign-up";

export function AuthPage() {
  const navigate = useNavigate();
  const {
    email: activeEmail,
    role,
    signInWithPassword,
    signUpWithPassword,
    signInWithGoogle,
    signOut,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState(activeEmail ?? "");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password || password.length < 8) {
      setMessage("Email and password (8+ chars) required.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    if (mode === "sign-in") {
      const error = await signInWithPassword(email, password);
      setIsSubmitting(false);
      if (error) { setMessage(error); return; }
      navigate({ to: "/" });
    } else {
      if (!name.trim()) { setMessage("Name required."); setIsSubmitting(false); return; }
      const error = await signUpWithPassword(name, email, password);
      setIsSubmitting(false);
      if (error) { setMessage(error); return; }
      setMessage("Account created. You can sign in now.");
      setMode("sign-in");
      setPassword("");
    }
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    const error = await signInWithGoogle("/");
    setIsSubmitting(false);
    if (error) setMessage(error);
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    const error = await signOut();
    setIsSubmitting(false);
    if (error) setMessage(error);
    else setMessage("Signed out.");
  };

  return (
    <div className="min-h-dvh bg-app">
      <SiteHeader />

      <main className="px-4 py-8 max-w-sm mx-auto safe-area-bottom">
        <h1 className="text-lg font-bold text-foreground">
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </h1>
        <p className="text-sm mt-1 text-secondary">
          {mode === "sign-in"
            ? "Welcome back."
            : "Set up your reading identity."}
        </p>

        {/* Mode toggle */}
        <div className="mt-4 flex gap-1">
          <button
            onClick={() => { setMode("sign-in"); setMessage(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              mode === "sign-in"
                ? "bg-primary text-on-primary font-medium"
                : "text-muted hover:text-secondary"
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => { setMode("sign-up"); setMessage(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              mode === "sign-up"
                ? "bg-primary text-on-primary font-medium"
                : "text-muted hover:text-secondary"
            }`}
          >
            Create account
          </button>
        </div>

        {/* Form */}
        <div className="mt-5 space-y-4">
          {mode === "sign-up" && (
            <div>
              <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider block mb-1.5 text-muted">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none bg-surface text-foreground border border-border placeholder:text-muted focus:border-foreground transition-colors"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider block mb-1.5 text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none bg-surface text-foreground border border-border placeholder:text-muted focus:border-foreground transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider block mb-1.5 text-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none bg-surface text-foreground border border-border placeholder:text-muted focus:border-foreground transition-colors"
              placeholder="8+ characters"
            />
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <button
            onClick={() => { void handleSubmit(); }}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl text-sm font-medium bg-primary text-on-primary transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "..." : mode === "sign-in" ? "Sign in" : "Create account"}
          </button>
          <button
            onClick={() => { void handleGoogle(); }}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl text-sm bg-surface text-foreground border border-border transition-colors"
          >
            Continue with Google
          </button>
        </div>

        {message && (
          <p className="text-xs mt-3 text-secondary">{message}</p>
        )}

        {/* Session info */}
        {role !== "guest" && (
          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-xs text-muted">
              Signed in as {activeEmail} &middot; {role}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => { void handleSignOut(); }}
                disabled={isSubmitting}
                className="px-3 py-1.5 rounded-lg text-xs text-muted hover:text-secondary transition-colors"
              >
                Sign out
              </button>
              <Link to="/" className="px-3 py-1.5 rounded-lg text-xs text-muted hover:text-secondary transition-colors">
                Library
              </Link>
              {role === "admin" && (
                <Link to="/admin" className="px-3 py-1.5 rounded-lg text-xs text-muted hover:text-secondary transition-colors">
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
