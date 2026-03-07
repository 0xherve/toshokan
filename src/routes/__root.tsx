import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import appCss from "../index.css?url";
import { AuthProvider } from "../lib/auth";

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Watashi" },
      { name: "theme-color", content: "#111111" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/pwa-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/pwa-512.png" },
      { rel: "mask-icon", href: "/mask-icon.svg", color: "#111111" },
      { rel: "apple-touch-icon", href: "/pwa-192.png" },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="min-h-dvh bg-app flex flex-col items-center justify-center px-4">
      <p className="text-sm text-muted">Page not found.</p>
      <Link to="/" className="mt-3 text-xs text-secondary hover:text-foreground transition-colors">
        &larr; Back to library
      </Link>
    </div>
  );
}

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
