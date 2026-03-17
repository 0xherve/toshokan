import { useState, useEffect, useCallback, useRef } from "react";
import { localDb } from "../lib/localDb";
import { upsertProgress } from "../../server/functions/progress/upsertProgress";
import { getProgress } from "../../server/functions/progress/getProgress";

const SYNC_DEBOUNCE_MS = 2000;

export function useReadingProgress(bookId: string, totalChapters = 0, initialChapter?: number) {
  const [currentChapter, setCurrentChapterState] = useState(initialChapter ?? 0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updatedAtRef = useRef<number>(Date.now());

  // Load initial state from Dexie then merge with server (skip if initialChapter was provided)
  useEffect(() => {
    if (initialChapter !== undefined) return;

    async function loadProgress() {
      const local = await localDb.readingProgress.get(bookId);

      // Fetch server progress and pick the most recent
      let best = local ?? null;
      try {
        const server = await getProgress({ data: bookId });
        if (server) {
          const serverUpdatedAt = new Date(server.clientUpdatedAt ?? server.updatedAt).getTime();
          const localUpdatedAt = local?.updatedAt ?? 0;

          if (serverUpdatedAt >= localUpdatedAt) {
            best = {
              bookId,
              chapterIndex: server.currentChapter,
              scrollPercent: Number(server.scrollPercent),
              updatedAt: serverUpdatedAt,
            };
            // Update local cache with server state
            await localDb.readingProgress.put(best);
          }
        }
      } catch {
        // offline — use local state
      }

      if (!best) return;
      const chapter =
        totalChapters > 0 && best.chapterIndex >= totalChapters
          ? 0
          : best.chapterIndex;
      setCurrentChapterState(chapter);
      if (best.scrollPercent) {
        setScrollPercent(best.scrollPercent);
      }
    }

    loadProgress();
  }, [bookId, totalChapters, initialChapter]);

  // Restore scroll position when chapter changes
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    localDb.readingProgress.get(bookId).then((saved) => {
      if (!saved || saved.chapterIndex !== currentChapter) return;
      requestAnimationFrame(() => {
        if (!scrollContainerRef.current) return;
        const el = scrollContainerRef.current;
        const maxScroll = el.scrollHeight - el.clientHeight;
        el.scrollTop = maxScroll * saved.scrollPercent;
      });
    });
  }, [currentChapter, bookId]);

  const saveToLocal = useCallback(
    (chapter: number, percent: number) => {
      const now = Date.now();
      updatedAtRef.current = now;
      localDb.readingProgress.put({
        bookId,
        chapterIndex: chapter,
        scrollPercent: percent,
        updatedAt: now,
      });
    },
    [bookId],
  );

  const scheduleSyncToServer = useCallback(
    (chapter: number, percent: number) => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        const clientUpdatedAt = new Date(updatedAtRef.current).toISOString();
        upsertProgress({
          data: {
            bookId,
            currentChapter: chapter,
            scrollPercent: percent,
            clientUpdatedAt,
          },
        }).catch(() => {
          // silent — will retry on next scroll/chapter change
        });
      }, SYNC_DEBOUNCE_MS);
    },
    [bookId],
  );

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const percent = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
    setScrollPercent(percent);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveToLocal(currentChapter, percent);
      scheduleSyncToServer(currentChapter, percent);
    }, 500);
  }, [currentChapter, saveToLocal, scheduleSyncToServer]);

  // Save on visibility hidden / unload
  useEffect(() => {
    const saveNow = () => {
      if (!scrollContainerRef.current) return;
      const el = scrollContainerRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const percent = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
      saveToLocal(currentChapter, percent);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") saveNow();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", saveNow);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", saveNow);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [currentChapter, saveToLocal]);

  const setCurrentChapter = useCallback(
    (index: number) => {
      if (totalChapters > 0 && (index < 0 || index >= totalChapters)) return;
      if (index < 0) return;

      // Save scroll for current chapter before switching
      if (scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        const maxScroll = el.scrollHeight - el.clientHeight;
        const percent = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
        saveToLocal(currentChapter, percent);
      }

      setCurrentChapterState(index);
      saveToLocal(index, 0);
      scheduleSyncToServer(index, 0);
    },
    [totalChapters, currentChapter, saveToLocal, scheduleSyncToServer],
  );

  const goNext = useCallback(() => {
    setCurrentChapter(currentChapter + 1);
  }, [currentChapter, setCurrentChapter]);

  const goPrev = useCallback(() => {
    setCurrentChapter(currentChapter - 1);
  }, [currentChapter, setCurrentChapter]);

  const bookProgress =
    totalChapters > 0 ? (currentChapter + scrollPercent) / totalChapters : 0;

  return {
    currentChapter,
    setCurrentChapter,
    goNext,
    goPrev,
    scrollPercent,
    bookProgress,
    handleScroll,
    scrollContainerRef,
  };
}
