import { useCallback, useEffect, useMemo, useState } from "react";
import { getBooks } from "../../server/functions/books/getBooks";
import { getAllBooks } from "../../server/functions/books/getAllBooks";
import { getBook } from "../../server/functions/books/getBook";
import { getChapters } from "../../server/functions/books/getChapters";

export type BookStatus = "draft" | "published" | "archived";

export interface BookItem {
  id: string;
  title: string;
  author: string;
  description: string;
  chapterCount: number;
  status: BookStatus;
  updatedAt: string;
}

export interface ChapterItem {
  index: number;
  title: string;
}

interface UseBooksOptions {
  includeUnpublished?: boolean;
}

function mapBook(row: Record<string, unknown>): BookItem {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? "Untitled"),
    author: String(row.author ?? "Unknown"),
    description: String(row.description ?? ""),
    chapterCount: Number(row.chapterCount ?? row.chapter_count ?? 0),
    status: (row.status as BookStatus) ?? "draft",
    updatedAt: String(row.updatedAt ?? row.updated_at ?? "").slice(0, 10),
  };
}

export function useBooks(options: UseBooksOptions = {}) {
  const { includeUnpublished = false } = options;
  const [booksList, setBooksList] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = includeUnpublished ? await getAllBooks() : await getBooks();
      setBooksList((data ?? []).map((row) => mapBook(row as Record<string, unknown>)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load books");
      setBooksList([]);
    } finally {
      setIsLoading(false);
    }
  }, [includeUnpublished]);

  useEffect(() => {
    void fetchBooks();
  }, [fetchBooks]);

  return useMemo(
    () => ({
      books: booksList,
      isLoading,
      error,
      refresh: fetchBooks,
    }),
    [booksList, error, fetchBooks, isLoading],
  );
}

export function useBook(bookId: string) {
  const [book, setBook] = useState<BookItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBook = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getBook({ data: bookId });
      setBook(data ? mapBook(data as Record<string, unknown>) : null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load book");
      setBook(null);
    } finally {
      setIsLoading(false);
    }
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
    setIsLoading(true);
    getChapters({ data: bookId })
      .then((data) => {
        setChapters(
          (data ?? []).map((r) => ({
            index: Number(r.chapterIndex),
            title: String(r.title),
          })),
        );
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load chapters");
      })
      .finally(() => setIsLoading(false));
  }, [bookId]);

  return { chapters, isLoading, error };
}
