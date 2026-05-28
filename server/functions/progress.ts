import { createServerFn } from "@tanstack/react-start";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth-guard";
import { db } from "../db";
import { readingProgress } from "../../src/db/schema";

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

type UpsertProgressInput = {
  bookId: string;
  currentChapter: number;
  scrollPercent: number;
  clientUpdatedAt: string;
};

export const upsertProgress = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: UpsertProgressInput }) => {
    const session = await requireAuth();
    const userId = session.user.id;
    const { bookId, currentChapter, scrollPercent, clientUpdatedAt } = data;

    const [existing] = await db
      .select({ clientUpdatedAt: readingProgress.clientUpdatedAt })
      .from(readingProgress)
      .where(
        and(
          eq(readingProgress.userId, userId),
          eq(readingProgress.bookId, bookId),
        ),
      )
      .limit(1);

    if (existing?.clientUpdatedAt) {
      const existingTs = new Date(existing.clientUpdatedAt).getTime();
      const incomingTs = new Date(clientUpdatedAt).getTime();
      if (incomingTs < existingTs) {
        return { ok: true, skipped: true };
      }
    }

    await db
      .insert(readingProgress)
      .values({
        userId,
        bookId,
        currentChapter,
        scrollPercent: String(scrollPercent),
        clientUpdatedAt: new Date(clientUpdatedAt),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [readingProgress.userId, readingProgress.bookId],
        set: {
          currentChapter,
          scrollPercent: String(scrollPercent),
          clientUpdatedAt: new Date(clientUpdatedAt),
          updatedAt: new Date(),
        },
      });

    return { ok: true, skipped: false };
  });
