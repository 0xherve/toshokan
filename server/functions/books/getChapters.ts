import { createServerFn } from "@tanstack/react-start";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../../lib/auth-guard";
import { db } from "../../db";
import { bookChapters } from "../../../src/db/schema";

export const getChapters = createServerFn({ method: "GET" })
  .handler(async ({ data: bookId }: { data: string }) => {
    await requireAuth();
    return db
      .select({
        chapterIndex: bookChapters.chapterIndex,
        title: bookChapters.title,
      })
      .from(bookChapters)
      .where(eq(bookChapters.bookId, bookId))
      .orderBy(asc(bookChapters.chapterIndex));
  });
