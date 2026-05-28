import { createServerFn } from "@tanstack/react-start";
import { eq, and, isNull } from "drizzle-orm";
import { requireAuth } from "../lib/auth-guard";
import { db } from "../db";
import { bookmarks } from "../../src/db/schema";

type CreateBookmarkInput = {
  id: string;
  bookId: string;
  chapterIndex: number;
  chapterTitle: string;
  scrollPercent: number;
  excerpt: string;
  createdAt: string;
};

export const createBookmark = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: CreateBookmarkInput }) => {
    const session = await requireAuth();
    const userId = session.user.id;

    await db
      .insert(bookmarks)
      .values({
        id: data.id,
        userId,
        bookId: data.bookId,
        chapterIndex: data.chapterIndex,
        chapterTitle: data.chapterTitle,
        scrollPercent: String(data.scrollPercent),
        excerpt: data.excerpt,
        createdAt: new Date(data.createdAt),
      })
      .onConflictDoNothing();

    return { ok: true };
  });

export const deleteBookmark = createServerFn({ method: "POST" })
  .handler(async ({ data: bookmarkId }: { data: string }) => {
    const session = await requireAuth();
    const userId = session.user.id;

    await db
      .update(bookmarks)
      .set({ deletedAt: new Date() })
      .where(
        and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, userId)),
      );

    return { ok: true };
  });

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
