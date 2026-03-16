import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { requireAuth } from "../../lib/auth-guard";
import { db } from "../../db";
import { readingProgress } from "../../../src/db/schema";

export const getAllProgress = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await requireAuth();
    const userId = session.user.id;

    return db
      .select()
      .from(readingProgress)
      .where(eq(readingProgress.userId, userId));
  },
);
