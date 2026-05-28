import { createServerFn } from "@tanstack/react-start";
import { eq, gte, lte, and, asc } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../lib/auth-guard";
import { db } from "../db";
import { books, bookChapters } from "../../src/db/schema";
import { uploadToR2 } from "../lib/r2";

const BOOK_SELECT = {
  id: books.id,
  title: books.title,
  author: books.author,
  description: books.description,
  status: books.status,
  chapterCount: books.chapterCount,
  updatedAt: books.updatedAt,
} as const;

export const getBooks = createServerFn({ method: "GET" }).handler(async () => {
  return db
    .select(BOOK_SELECT)
    .from(books)
    .where(eq(books.status, "published"))
    .orderBy(books.updatedAt);
});

export const getAllBooks = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return db.select(BOOK_SELECT).from(books).orderBy(books.updatedAt);
});

export const getBook = createServerFn({ method: "GET" })
  .handler(async ({ data: bookId }: { data: string }) => {
    const [book] = await db
      .select(BOOK_SELECT)
      .from(books)
      .where(and(eq(books.id, bookId), eq(books.status, "published")))
      .limit(1);
    return book ?? null;
  });

export const getChapters = createServerFn({ method: "GET" })
  .handler(async ({ data: bookId }: { data: string }) => {
    await requireAuth();
    return db
      .select({
        chapterIndex: bookChapters.chapterIndex,
        title: bookChapters.title,
      })
      .from(bookChapters)
      .where(eq(bookChapters.bookId, bookId))
      .orderBy(asc(bookChapters.chapterIndex));
  });

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

type ExtractedChapter = {
  chapterIndex: number;
  title: string;
  html: string;
};

type UploadBookInput = {
  title: string;
  author: string;
  status: "draft" | "published" | "archived";
  fileName: string;
  fileBase64: string;
  chapters: ExtractedChapter[];
};

export const uploadBook = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: UploadBookInput }) => {
    await requireAdmin();

    const { title, author, status, fileName, fileBase64, chapters } = data;

    const buffer = Buffer.from(fileBase64, "base64");
    const storageKey = `epubs/${crypto.randomUUID()}-${fileName.replace(/\s+/g, "-")}`;

    await uploadToR2(storageKey, buffer, "application/epub+zip");

    const [{ bookId, chapterCount }] = await db.transaction(async (tx) => {
      const [book] = await tx
        .insert(books)
        .values({
          title: title.trim(),
          author: author.trim() || "Unknown",
          status,
          epubStorageKey: storageKey,
          chapterCount: chapters.length,
        })
        .returning({ id: books.id });

      if (chapters.length > 0) {
        await tx.insert(bookChapters).values(
          chapters.map((ch) => ({
            bookId: book.id,
            chapterIndex: ch.chapterIndex,
            title: ch.title,
            html: ch.html,
          })),
        );
      }

      return { bookId: book.id, chapterCount: chapters.length };
    });

    return { bookId, chapterCount };
  });
