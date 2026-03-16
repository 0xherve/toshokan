import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "../../lib/auth-guard";
import { db } from "../../db";
import { books } from "../../../src/db/schema";

// Admin-only: returns all books regardless of status
export const getAllBooks = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      description: books.description,
      status: books.status,
      chapterCount: books.chapterCount,
      updatedAt: books.updatedAt,
    })
    .from(books)
    .orderBy(books.updatedAt);
});
