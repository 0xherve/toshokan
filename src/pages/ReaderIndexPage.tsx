import { Link } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";

export function ReaderIndexPage() {
  return (
    <div className="min-h-dvh bg-app">
      <SiteHeader />
      <main className="px-4 py-16 max-w-sm mx-auto text-center">
        <p className="text-sm text-muted">No book selected.</p>
        <Link
          to="/"
          className="inline-block mt-4 text-xs text-secondary hover:text-foreground transition-colors"
        >
          &larr; Choose from library
        </Link>
      </main>
    </div>
  );
}
