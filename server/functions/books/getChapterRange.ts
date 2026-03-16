import { createServerFn } from "@tanstack/react-start";
import { eq, gte, lte, and, asc } from "drizzle-orm";
import { requireAuth } from "../../lib/auth-guard";
import { db } from "../../db";
import { bookChapters } from "../../../src/db/schema";

type GetChapterRangeInput = {
  bookId: string;
  from: number;
  to: number;
};

export const getChapterRange = createServerFn({ method: "GET" })
  .handler(async ({ data }: { data: GetChapterRangeInput }) => {
    await requireAuth();
    const { bookId, from, to } = data;
    return db
      .select({
        chapterIndex: bookChapters.chapterIndex,
        title: bookChapters.title,
        html: bookChapters.html,
      })
      .from(bookChapters)
      .where(
        and(
          eq(bookChapters.bookId, bookId),
          gte(bookChapters.chapterIndex, from),
          lte(bookChapters.chapterIndex, to),
        ),
      )
      .orderBy(asc(bookChapters.chapterIndex));
  });
