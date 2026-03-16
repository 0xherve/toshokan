import { createServerFn } from "@tanstack/react-start";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../../lib/auth-guard";
import { db } from "../../db";
import { bookmarks } from "../../../src/db/schema";

export const deleteBookmark = createServerFn({ method: "POST" })
  .handler(async ({ data: bookmarkId }: { data: string }) => {
    const session = await requireAuth();
    const userId = session.user.id;

    // Soft delete — only the owning user can delete their bookmarks
    await db
      .update(bookmarks)
      .set({ deletedAt: new Date() })
      .where(
        and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, userId)),
      );

    return { ok: true };
  });
