import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "../../lib/auth-guard";
import { db } from "../../db";
import { bookmarks } from "../../../src/db/schema";

type CreateBookmarkInput = {
  id: string; // client-generated uuid for offline sync
  bookId: string;
  chapterIndex: number;
  chapterTitle: string;
  scrollPercent: number;
  excerpt: string;
  createdAt: string; // ISO timestamp
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
