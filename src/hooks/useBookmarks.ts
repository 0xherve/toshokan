import { useState, useEffect, useCallback } from "react";
import { localDb, type LocalBookmark } from "../lib/localDb";
import { getBookmarks } from "../../server/functions/bookmarks/getBookmarks";
import { createBookmark } from "../../server/functions/bookmarks/createBookmark";
import { deleteBookmark } from "../../server/functions/bookmarks/deleteBookmark";

export type { LocalBookmark as Bookmark };

async function flushUnsyncedBookmarks(bookId: string) {
  const unsynced = await localDb.bookmarks
    .where("synced")
    .equals(0) // Dexie stores false as 0
    .filter((b) => b.bookId === bookId && b.deletedAt === null)
    .toArray();

  for (const bm of unsynced) {
    try {
      await createBookmark({
        data: {
          id: bm.id,
          bookId: bm.bookId,
          chapterIndex: bm.chapterIndex,
          chapterTitle: bm.chapterTitle,
          scrollPercent: bm.scrollPercent,
          excerpt: bm.excerpt,
          createdAt: new Date(bm.createdAt).toISOString(),
        },
      });
      await localDb.bookmarks.update(bm.id, { synced: true });
    } catch {
      // retry next time
    }
  }
}

async function pullServerBookmarks(bookId: string) {
  try {
    const serverBms = await getBookmarks({ data: bookId });
    const serverIds = new Set(serverBms.map((b) => b.id));

    // Upsert bookmarks that exist on the server
    for (const bm of serverBms) {
      const existing = await localDb.bookmarks.get(bm.id);
      if (!existing) {
        await localDb.bookmarks.put({
          id: bm.id,
          bookId: bm.bookId,
          chapterIndex: bm.chapterIndex,
          chapterTitle: bm.chapterTitle ?? "",
          scrollPercent: Number(bm.scrollPercent),
          excerpt: bm.excerpt ?? "",
          createdAt: new Date(bm.createdAt).getTime(),
          deletedAt: null,
          synced: true,
        });
      }
    }

    // Soft-delete local bookmarks that the server no longer has (deleted on another device)
    const localBms = await localDb.bookmarks
      .where("bookId")
      .equals(bookId)
      .filter((b) => b.deletedAt === null && b.synced === true)
      .toArray();

    for (const local of localBms) {
      if (!serverIds.has(local.id)) {
        await localDb.bookmarks.update(local.id, { deletedAt: Date.now() });
      }
    }
  } catch {
    // offline — local state is the truth
  }
}

export function useBookmarks(bookId: string) {
  const [bookmarks, setBookmarksState] = useState<LocalBookmark[]>([]);

  const loadLocal = useCallback(async () => {
    const local = await localDb.bookmarks
      .where("bookId")
      .equals(bookId)
      .filter((b) => b.deletedAt === null)
      .sortBy("createdAt");
    setBookmarksState(local.reverse());
  }, [bookId]);

  useEffect(() => {
    void loadLocal();
  }, [loadLocal]);

  // On mount: flush unsynced then pull server state
  useEffect(() => {
    flushUnsyncedBookmarks(bookId)
      .then(() => pullServerBookmarks(bookId))
      .then(() => loadLocal())
      .catch(() => {});
  }, [bookId, loadLocal]);

  const addBookmark = useCallback(
    async (
      chapterIndex: number,
      chapterTitle: string,
      scrollPercent: number,
      excerpt: string,
    ) => {
      const bm: LocalBookmark = {
        id: crypto.randomUUID(),
        bookId,
        chapterIndex,
        chapterTitle,
        scrollPercent,
        excerpt: excerpt.slice(0, 120),
        createdAt: Date.now(),
        deletedAt: null,
        synced: false,
      };

      await localDb.bookmarks.put(bm);
      await loadLocal();

      // Fire-and-forget sync
      createBookmark({
        data: {
          id: bm.id,
          bookId: bm.bookId,
          chapterIndex: bm.chapterIndex,
          chapterTitle: bm.chapterTitle,
          scrollPercent: bm.scrollPercent,
          excerpt: bm.excerpt,
          createdAt: new Date(bm.createdAt).toISOString(),
        },
      })
        .then(() => localDb.bookmarks.update(bm.id, { synced: true }))
        .catch(() => {});
    },
    [bookId, loadLocal],
  );

  const removeBookmark = useCallback(
    async (id: string) => {
      await localDb.bookmarks.update(id, { deletedAt: Date.now() });
      await loadLocal();

      deleteBookmark({ data: id }).catch(() => {});
    },
    [loadLocal],
  );

  return { bookmarks, addBookmark, removeBookmark };
}
