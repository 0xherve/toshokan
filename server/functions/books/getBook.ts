import { createServerFn } from "@tanstack/react-start";
import { eq, and, ne } from "drizzle-orm";
import { db } from "../../db";
import { books } from "../../../src/db/schema";

export const getBook = createServerFn({ method: "GET" })
  .handler(async ({ data: bookId }: { data: string }) => {
    const [book] = await db
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
      .where(and(eq(books.id, bookId), ne(books.status, "archived")))
      .limit(1);
    return book ?? null;
  });
