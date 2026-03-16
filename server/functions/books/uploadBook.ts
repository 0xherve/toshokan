import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "../../lib/auth-guard";
import { db } from "../../db";
import { books, bookChapters } from "../../../src/db/schema";
import { uploadToR2 } from "../../lib/r2";

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

    const [book] = await db
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
      await db.insert(bookChapters).values(
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
