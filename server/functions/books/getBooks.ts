import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { books } from "../../../src/db/schema";

export const getBooks = createServerFn({ method: "GET" }).handler(async () => {
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
    .where(eq(books.status, "published"))
    .orderBy(books.updatedAt);
});
