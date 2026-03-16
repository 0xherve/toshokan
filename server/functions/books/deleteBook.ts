import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../lib/auth-guard";
import { db } from "../../db";
import { books } from "../../../src/db/schema";
import { deleteFromR2 } from "../../lib/r2";

export const deleteBook = createServerFn({ method: "POST" })
  .handler(async ({ data: bookId }: { data: string }) => {
    await requireAdmin();

    const [book] = await db
      .select({ epubStorageKey: books.epubStorageKey })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    await db
      .update(books)
      .set({ status: "archived", updatedAt: new Date() })
      .where(eq(books.id, bookId));

    if (book?.epubStorageKey) {
      await deleteFromR2(book.epubStorageKey).catch(() => {});
    }

    return { ok: true };
  });
