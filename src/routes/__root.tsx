import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from "@tanstack/react-router";
import appCss from "../index.css?url";
import { AuthProvider } from "../lib/auth";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Toshokan" },
      { name: "theme-color", content: "#141210" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/pwa-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/pwa-512.png" },
      { rel: "mask-icon", href: "/mask-icon.svg", color: "#141210" },
      { rel: "apple-touch-icon", href: "/pwa-192.png" },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-4">
      <p className="text-sm text-foreground-muted font-ui">Page not found.</p>
      <Link to="/library" className="mt-3 text-xs text-foreground-soft hover:text-foreground transition-colors font-ui">
        &larr; Back to library
      </Link>
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const isReader = location.pathname.startsWith("/read/") || location.pathname === "/read";
  const isAuth = location.pathname.startsWith("/auth");

  if (isReader || isAuth) {
    return <Outlet />;
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function RootDocument() {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
