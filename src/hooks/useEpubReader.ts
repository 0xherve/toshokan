import { useState, useEffect, useCallback, useRef } from "react";
import { localDb } from "../lib/localDb";
import { getChapters } from "../../server/functions/books/getChapters";
import { getChapterRange } from "../../server/functions/books/getChapterRange";
import type { ChapterData } from "../lib/constants";

const PREFETCH_BACK = 5;
const PREFETCH_AHEAD = 20;
const EVICT_BEYOND = 50;

interface UseEpubReaderReturn {
  isLoading: boolean;
  error: string | null;
  chapters: ChapterData[];
  totalChapters: number;
}

export function useEpubReader(
  bookId: string,
  currentChapter: number,
): UseEpubReaderReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterMetas, setChapterMetas] = useState<
    { index: number; title: string }[]
  >([]);
  const [htmlCache, setHtmlCache] = useState<Record<number, string>>({});
  const loadingWindowRef = useRef<string | null>(null);

  // Load chapter list; reset all state when bookId changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setChapterMetas([]);
    setHtmlCache({});
    loadingWindowRef.current = null;

    getChapters({ data: bookId })
      .then((data) => {
        setChapterMetas(
          (data ?? []).map((r) => ({
            index: Number(r.chapterIndex),
            title: String(r.title),
          })),
        );
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load book");
      })
      .finally(() => setIsLoading(false));
  }, [bookId]);

  const loadWindow = useCallback(
    async (center: number) => {
      const from = Math.max(0, center - PREFETCH_BACK);
      const to = center + PREFETCH_AHEAD;
      const windowKey = `${bookId}:${from}-${to}`;

      if (loadingWindowRef.current === windowKey) return;
      loadingWindowRef.current = windowKey;

      // Check Dexie for cached chapters in range
      const cached = await localDb.cachedChapters
        .where("[bookId+chapterIndex]")
        .between([bookId, from], [bookId, to], true, true)
        .toArray();

      const cachedIndices = new Set(cached.map((c) => c.chapterIndex));
      const hasMissing = Array.from(
        { length: to - from + 1 },
        (_, i) => from + i,
      ).some((i) => !cachedIndices.has(i));

      let fetched: { chapterIndex: number; title: string; html: string }[] = [];
      if (hasMissing) {
        try {
          fetched = await getChapterRange({
            data: { bookId, from, to },
          });

          const now = Date.now();
          await localDb.cachedChapters.bulkPut(
            fetched.map((ch) => ({
              bookId,
              chapterIndex: ch.chapterIndex,
              title: ch.title,
              html: ch.html,
              cachedAt: now,
            })),
          );
        } catch {
          // offline — use what's in cache
        }
      }

      // Evict chapters far outside the current window (only when center is far enough)
      const evictBefore = center - EVICT_BEYOND;
      const evictAfter = center + EVICT_BEYOND;
      if (evictBefore > 0 && evictAfter < 9999) {
        await localDb.cachedChapters
          .where("bookId")
          .equals(bookId)
          .filter(
            (c) => c.chapterIndex < evictBefore || c.chapterIndex > evictAfter,
          )
          .delete();
      }

      // Merge cache + fetched into htmlCache state
      const allChapters = [
        ...cached,
        ...fetched.map((f) => ({
          bookId,
          chapterIndex: f.chapterIndex,
          html: f.html,
          title: f.title,
          cachedAt: Date.now(),
        })),
      ];

      if (allChapters.length > 0) {
        setHtmlCache((prev) => {
          const next = { ...prev };
          for (const ch of allChapters) {
            next[ch.chapterIndex] = ch.html;
          }
          return next;
        });
      }
    },
    [bookId],
  );

  // Load window when chapter or chapter list changes
  useEffect(() => {
    if (chapterMetas.length === 0) return;
    void loadWindow(currentChapter);
  }, [currentChapter, chapterMetas.length, loadWindow]);

  const chapters: ChapterData[] = chapterMetas.map((meta) => ({
    href: `chapter-${meta.index}`,
    html: htmlCache[meta.index] ?? "",
    title: meta.title,
    index: meta.index,
  }));

  return {
    isLoading,
    error,
    chapters,
    totalChapters: chapterMetas.length,
  };
}
