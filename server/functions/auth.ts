import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "../auth";

export const getSessionInfo = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return { authenticated: false, role: null } as const;
    const user = session.user as { role?: string };
    return {
      authenticated: true,
      role: (user?.role as "user" | "admin") ?? "user",
    } as const;
  },
);
