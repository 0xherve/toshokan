import { createServerFn } from "@tanstack/react-start";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../../lib/auth-guard";
import { db } from "../../db";
import { readingProgress } from "../../../src/db/schema";

export const getProgress = createServerFn({ method: "GET" })
  .handler(async ({ data: bookId }: { data: string }) => {
    const session = await requireAuth();
    const userId = session.user.id;

    const [row] = await db
      .select()
      .from(readingProgress)
      .where(
        and(
          eq(readingProgress.userId, userId),
          eq(readingProgress.bookId, bookId),
        ),
      )
      .limit(1);

    return row ?? null;
  });
