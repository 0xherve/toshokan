import { Link } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";

export function ReaderIndexPage() {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: "var(--bg-app)" }}>
      <SiteHeader />
      <main className="px-4 py-6 max-w-[36rem] mx-auto safe-area-bottom">
        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Select a book to start reading
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            Reader now loads books from Supabase records.
          </p>
          <Link
            to="/"
            className="inline-block mt-4 px-4 py-2 rounded-xl text-sm"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-on-primary)",
              border: "1px solid var(--border)",
            }}
          >
            Go to library
          </Link>
        </div>
      </main>
    </div>
  );
}
