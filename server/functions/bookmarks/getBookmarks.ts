import { createServerFn } from "@tanstack/react-start";
import { eq, and, isNull } from "drizzle-orm";
import { requireAuth } from "../../lib/auth-guard";
import { db } from "../../db";
import { bookmarks } from "../../../src/db/schema";

export const getBookmarks = createServerFn({ method: "GET" })
  .handler(async ({ data: bookId }: { data: string }) => {
    const session = await requireAuth();
    const userId = session.user.id;

    return db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.bookId, bookId),
          isNull(bookmarks.deletedAt),
        ),
      )
      .orderBy(bookmarks.createdAt);
  });
