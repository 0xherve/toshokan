import { Link } from "@tanstack/react-router";

export function ReaderIndexPage() {
  return (
    <div className="min-h-dvh bg-background">
      <main className="px-4 py-16 max-w-sm mx-auto text-center">
        <p className="text-sm text-foreground-muted font-ui">No book selected.</p>
        <Link
          to="/library"
          className="inline-block mt-4 text-xs text-foreground-soft hover:text-foreground transition-colors font-ui"
        >
          &larr; Choose from library
        </Link>
      </main>
    </div>
  );
}
