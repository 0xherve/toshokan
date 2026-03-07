import { createMiddleware, createStart } from "@tanstack/react-start";

const authRouteMiddleware = createMiddleware({ type: "request" }).server(
  async ({ pathname, request, next }) => {
    if (pathname.startsWith("/api/auth")) {
      const { auth } = await import("../server/auth");
      return auth.handler(request);
    }

    return next();
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [authRouteMiddleware],
}));
