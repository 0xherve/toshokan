import { useState, useCallback } from "react";
import { getBookmarks, saveBookmarks } from "../lib/storage";
import type { Bookmark } from "../lib/constants";

export function useBookmarks() {
  const [bookmarks, setBookmarksState] = useState<Bookmark[]>(() =>
    getBookmarks(),
  );

  const addBookmark = useCallback(
    (
      chapterIndex: number,
      chapterTitle: string,
      scrollPercent: number,
      excerpt: string,
    ) => {
      const newBookmark: Bookmark = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        chapterIndex,
        chapterTitle,
        scrollPercent,
        excerpt: excerpt.slice(0, 120),
        createdAt: Date.now(),
      };
      setBookmarksState((prev) => {
        const updated = [newBookmark, ...prev];
        saveBookmarks(updated);
        return updated;
      });
    },
    [],
  );

  const removeBookmark = useCallback((id: string) => {
    setBookmarksState((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      saveBookmarks(updated);
      return updated;
    });
  }, []);

  return { bookmarks, addBookmark, removeBookmark };
}
