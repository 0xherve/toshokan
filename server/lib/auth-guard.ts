import { getRequest } from "@tanstack/react-start/server";
import { auth } from "../auth";

export async function requireAuth() {
  const request = getRequest();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  const user = session.user as { role?: string };
  if (user?.role !== "admin") throw new Error("Forbidden");
  return session;
}
