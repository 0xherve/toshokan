import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { useAuth } from "../lib/auth";

export function AuthPage() {
  const navigate = useNavigate();
  const { email: activeEmail, role, signInWithPassword, signUpWithPassword, signOut } =
    useAuth();

  const [email, setEmail] = useState(activeEmail ?? "");
  const [name, setName] = useState("Watashi Reader");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    const error = await signInWithPassword(email, password);
    if (error) {
      setMessage(error);
      return;
    }
    setMessage("Signed in successfully.");
    navigate({ to: "/" });
  };

  const handleSignUp = async () => {
    const error = await signUpWithPassword(name, email, password);
    if (error) {
      setMessage(error);
      return;
    }
    setMessage("Account created. You can now sign in.");
  };

  const handleSignOut = async () => {
    const error = await signOut();
    if (error) {
      setMessage(error);
      return;
    }
    setMessage("Signed out.");
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
            Better Auth
          </p>
          <h1 className="text-lg font-bold mt-1" style={{ color: "var(--text-primary)" }}>
            Account access
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            Sign in with your app-owned account identity.
          </p>

          <label
            htmlFor="name"
            className="text-xs font-medium uppercase tracking-wider block mt-5 mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-app)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          />

          <label
            htmlFor="email"
            className="text-xs font-medium uppercase tracking-wider block mt-4 mb-2"
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

          <label
            htmlFor="password"
            className="text-xs font-medium uppercase tracking-wider block mt-4 mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-app)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          />

          <div className="mt-4 grid gap-2">
            <button
              onClick={() => {
                void handleSignIn();
              }}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-on-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Sign in
            </button>
            <button
              onClick={() => {
                void handleSignUp();
              }}
              className="w-full py-3 rounded-xl text-sm transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--bg-app)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Create account
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
            Role: {role}
            {activeEmail ? ` . ${activeEmail}` : ""}
          </p>
          {message && (
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              {message}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                void handleSignOut();
              }}
              className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--bg-app)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              Sign out
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
