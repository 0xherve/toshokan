import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { signIn, signOut, useDemoSession } from "../lib/demoSession";

export function AuthPage() {
  const session = useDemoSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState(session.email ?? "reader@watashi.fun");

  const handleSignInUser = () => {
    signIn("user", email);
    navigate({ to: "/" });
  };

  const handleSignInAdmin = () => {
    signIn("admin", email);
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-dvh" style={{ backgroundColor: "var(--bg-app)" }}>
      <SiteHeader />

      <main className="px-4 py-6 max-w-[36rem] mx-auto safe-area-bottom">
        <section
          className="rounded-2xl border p-5"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: "var(--text-muted)" }}
          >
            Account
          </p>
          <h1 className="text-lg font-bold mt-1" style={{ color: "var(--text-primary)" }}>
            Sign in to sync your reading
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            This frontend build uses a temporary local session model. Backend auth will
            replace this in the next phase.
          </p>

          <label
            htmlFor="email"
            className="text-xs font-medium uppercase tracking-wider block mt-5 mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-app)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          />

          <div className="mt-4 grid gap-2">
            <button
              onClick={handleSignInUser}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-on-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Continue as reader
            </button>
            <button
              onClick={handleSignInAdmin}
              className="w-full py-3 rounded-xl text-sm transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--bg-app)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Continue as admin
            </button>
          </div>
        </section>

        <section
          className="mt-4 rounded-2xl border p-4"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Current session
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Role: {session.role}
            {session.email ? ` . ${session.email}` : ""}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={signOut}
              className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--bg-app)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              Clear session
            </button>
            <Link
              to="/"
              className="px-3 py-2 rounded-lg text-xs transition-colors"
              style={{
                backgroundColor: "var(--bg-app)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Go to library
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
