import { createMiddleware, createStart } from "@tanstack/react-start";

const protectedRoutes: { pattern: string; role?: string }[] = [
  { pattern: "/admin", role: "admin" },
  { pattern: "/read/" },
];

const authRouteMiddleware = createMiddleware({ type: "request" }).server(
  async ({ pathname, request, next }) => {
    if (pathname.startsWith("/api/auth")) {
      const { auth } = await import("@server/auth");
      return auth.handler(request);
    }

    if (pathname.startsWith("/auth/")) {
      const { auth } = await import("@server/auth");
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      if (session) {
        return new Response(null, {
          status: 302,
          headers: { Location: "/library" },
        });
      }
      return next();
    }

    const match = protectedRoutes.find((r) => pathname.startsWith(r.pattern));
    if (match) {
      const { auth } = await import("@server/auth");
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        const redirect = `/auth/signin?redirect=${encodeURIComponent(pathname)}`;
        return new Response(null, {
          status: 302,
          headers: { Location: redirect },
        });
      }

      if (
        match.role === "admin" &&
        (session.user as { role?: string }).role !== "admin"
      ) {
        return new Response(null, {
          status: 302,
          headers: { Location: "/library" },
        });
      }
    }

    return next();
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [authRouteMiddleware],
}));
