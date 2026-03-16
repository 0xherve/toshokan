import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";
import { requireAdmin } from "../../lib/auth-guard";
import { db } from "../../db";
import { users } from "../../../src/db/schema";

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));
});
