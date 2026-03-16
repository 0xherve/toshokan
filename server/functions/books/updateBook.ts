import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../lib/auth-guard";
import { db } from "../../db";
import { books } from "../../../src/db/schema";

type UpdateBookInput = {
  bookId: string;
  title?: string;
  author?: string;
  description?: string;
  status?: "draft" | "published" | "archived";
};

export const updateBook = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: UpdateBookInput }) => {
    await requireAdmin();
    const { bookId, ...fields } = data;

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (fields.title !== undefined) updates.title = fields.title.trim();
    if (fields.author !== undefined) updates.author = fields.author.trim();
    if (fields.description !== undefined) updates.description = fields.description;
    if (fields.status !== undefined) updates.status = fields.status;

    await db.update(books).set(updates).where(eq(books.id, bookId));
    return { ok: true };
  });
