import { useState, useEffect, useCallback, useRef } from "react";
import {
  getChapterIndex,
  saveChapterIndex,
  getScrollPositions,
  saveScrollPosition,
} from "../lib/storage";

export function useReadingProgress(totalChapters: number) {
  const [currentChapter, setCurrentChapterState] = useState(() => {
    const saved = getChapterIndex();
    if (totalChapters > 0 && saved >= totalChapters) return 0;
    return saved;
  });
  const [scrollPercent, setScrollPercent] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const positions = getScrollPositions();
    const savedPercent = positions[currentChapter] || 0;

    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;
      const el = scrollContainerRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;
      el.scrollTop = maxScroll * savedPercent;
    });
  }, [currentChapter]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const percent = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
    setScrollPercent(percent);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveScrollPosition(currentChapter, percent);
    }, 500);
  }, [currentChapter]);

  useEffect(() => {
    const saveNow = () => {
      if (!scrollContainerRef.current) return;
      const el = scrollContainerRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const percent = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
      saveScrollPosition(currentChapter, percent);
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
  }, [currentChapter]);

  const setCurrentChapter = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalChapters) return;
      if (scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        const maxScroll = el.scrollHeight - el.clientHeight;
        const percent = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
        saveScrollPosition(currentChapter, percent);
      }
      setCurrentChapterState(index);
      saveChapterIndex(index);
    },
    [totalChapters, currentChapter],
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
