import { useCallback, useEffect, useMemo, useState } from "react";
import ePub from "epubjs";
import type Book from "epubjs/types/book";
import type Section from "epubjs/types/section";
import { supabase } from "../lib/supabase";
import { sanitizeHtml } from "../lib/sanitize";
import { getChapterIndexForBook } from "../lib/storage";

export type BookStatus = "draft" | "published" | "archived";

export interface BookItem {
  id: string;
  title: string;
  author: string;
  description: string;
  chapterCount: number;
  completion: number;
  status: BookStatus;
  updatedAt: string;
  epubUrl: string;
}

export interface ChapterItem {
  index: number;
  title: string;
}

interface UseBooksOptions {
  includeUnpublished?: boolean;
}

type UploadBookInput = {
  title: string;
  author: string;
  status: BookStatus;
  file: File;
};

function mapBook(row: Record<string, unknown>): BookItem {
  const id = String(row.id ?? "");
  const chapterCount = Number(row.chapter_count ?? 0);
  const chapterIndex = getChapterIndexForBook(id);
  const completion = chapterCount > 0 ? chapterIndex / chapterCount : 0;

  return {
    id,
    title: String(row.title ?? "Untitled"),
    author: String(row.author ?? "Unknown"),
    description: String(row.description ?? ""),
    chapterCount,
    completion,
    status: (row.status as BookStatus) ?? "draft",
    updatedAt: String(row.updated_at ?? "").slice(0, 10),
    epubUrl: String(row.epub_url ?? ""),
  };
}

type UploadExtractedChapter = {
  chapterIndex: number;
  title: string;
  html: string;
};

async function extractSanitizedChapters(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const book = ePub(arrayBuffer);
  const chapters: UploadExtractedChapter[] = [];

  try {
    await (book as Book).ready;
    const spineItems: Section[] = (
      book.spine as unknown as { spineItems: Section[] }
    ).spineItems;

    for (const item of spineItems ?? []) {
      try {
        await item.load(book.load.bind(book));
        const rawHtml = item.document?.body?.innerHTML ?? item.output ?? "";
        const html = sanitizeHtml(rawHtml);
        if (!html.trim()) continue;

        const headingMatch = html.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
        const title = headingMatch
          ? headingMatch[1].replace(/<[^>]+>/g, "").trim()
          : `Chapter ${item.index + 1}`;

        chapters.push({
          chapterIndex: item.index,
          title,
          html,
        });
      } catch {
        /* keep ingest moving */
      } finally {
        item.unload();
      }
    }
  } finally {
    (book as Book).destroy();
  }

  return chapters;
}

export function useBooks(options: UseBooksOptions = {}) {
  const { includeUnpublished = false } = options;
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    if (!supabase) {
      setBooks([]);
      setError("Supabase is not configured.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const query = supabase
      .from("books")
      .select("id,title,author,description,chapter_count,status,updated_at,epub_url")
      .order("updated_at", { ascending: false });

    const filteredQuery = includeUnpublished
      ? query
      : query.eq("status", "published");

    const { data, error } = await filteredQuery;
    if (error) {
      setError(error.message);
      setBooks([]);
      setIsLoading(false);
      return;
    }

    setBooks((data ?? []).map((row) => mapBook(row as Record<string, unknown>)));
    setError(null);
    setIsLoading(false);
  }, [includeUnpublished]);

  useEffect(() => {
    void fetchBooks();
  }, [fetchBooks]);

  const uploadBook = useCallback(
    async ({ title, author, status, file }: UploadBookInput) => {
      if (!supabase) return "Supabase is not configured.";

      const storagePath = `epubs/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage
        .from("books")
        .upload(storagePath, file, {
          contentType: file.type || "application/epub+zip",
          upsert: false,
        });

      if (uploadError) return uploadError.message;

      const publicUrl = supabase.storage.from("books").getPublicUrl(storagePath).data
        .publicUrl;

      const chapters = await extractSanitizedChapters(file);

      const { data: insertedBook, error: insertBookError } = await supabase
        .from("books")
        .insert({
          title: title.trim(),
          author: author.trim() || "Unknown",
          status,
          epub_url: publicUrl,
          chapter_count: chapters.length,
        })
        .select("id")
        .single();

      if (insertBookError) return insertBookError.message;

      if (chapters.length > 0) {
        const { error: insertChapterError } = await supabase
          .from("book_chapters")
          .insert(
            chapters.map((chapter) => ({
              book_id: insertedBook.id,
              chapter_index: chapter.chapterIndex,
              title: chapter.title,
              html: chapter.html,
            })),
          );
        if (insertChapterError) return insertChapterError.message;
      }

      await fetchBooks();
      return null;
    },
    [fetchBooks],
  );

  return useMemo(
    () => ({
      books,
      isLoading,
      error,
      refresh: fetchBooks,
      uploadBook,
    }),
    [books, error, fetchBooks, isLoading, uploadBook],
  );
}

export function useBook(bookId: string) {
  const [book, setBook] = useState<BookItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBook = useCallback(async () => {
    if (!supabase) {
      setError("Supabase is not configured.");
      setBook(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("books")
      .select("id,title,author,description,chapter_count,status,updated_at,epub_url")
      .eq("id", bookId)
      .single();

    if (error) {
      setError(error.message);
      setBook(null);
      setIsLoading(false);
      return;
    }

    setBook(mapBook(data as Record<string, unknown>));
    setError(null);
    setIsLoading(false);
  }, [bookId]);

  useEffect(() => {
    void loadBook();
  }, [loadBook]);

  return { book, isLoading, error, refresh: loadBook };
}

export function useChapters(bookId: string) {
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError("Supabase is not configured.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    void supabase
      .from("book_chapters")
      .select("chapter_index,title")
      .eq("book_id", bookId)
      .order("chapter_index", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setIsLoading(false);
          return;
        }
        setChapters(
          (data ?? []).map((r) => ({
            index: Number(r.chapter_index),
            title: String(r.title),
          })),
        );
        setIsLoading(false);
      });
  }, [bookId]);

  return { chapters, isLoading, error };
}
