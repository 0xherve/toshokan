import { useState, useEffect, useCallback, useRef } from "react";
import {
  getChapterIndexForBook,
  saveChapterIndexForBook,
  getScrollPositionsForBook,
  saveScrollPositionForBook,
} from "../lib/storage";

export function useReadingProgress(totalChapters: number, bookId: string) {
  const [currentChapter, setCurrentChapterState] = useState(() => {
    const saved = getChapterIndexForBook(bookId);
    if (totalChapters > 0 && saved >= totalChapters) return 0;
    return saved;
  });
  const [scrollPercent, setScrollPercent] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const positions = getScrollPositionsForBook(bookId);
    const savedPercent = positions[currentChapter] || 0;

    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;
      const el = scrollContainerRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;
      el.scrollTop = maxScroll * savedPercent;
    });
  }, [currentChapter, bookId]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const percent = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
    setScrollPercent(percent);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveScrollPositionForBook(bookId, currentChapter, percent);
    }, 500);
  }, [currentChapter, bookId]);

  useEffect(() => {
    const saveNow = () => {
      if (!scrollContainerRef.current) return;
      const el = scrollContainerRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const percent = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
      saveScrollPositionForBook(bookId, currentChapter, percent);
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
    };
  }, [currentChapter, bookId]);

  const setCurrentChapter = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalChapters) return;
      if (scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        const maxScroll = el.scrollHeight - el.clientHeight;
        const percent = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
        saveScrollPositionForBook(bookId, currentChapter, percent);
      }
      setCurrentChapterState(index);
      saveChapterIndexForBook(bookId, index);
    },
    [totalChapters, currentChapter, bookId],
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
