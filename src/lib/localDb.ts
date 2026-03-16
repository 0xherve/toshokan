import Dexie, { type Table } from "dexie";

export interface CachedChapter {
  bookId: string;
  chapterIndex: number;
  title: string;
  html: string;
  cachedAt: number;
}

export interface LocalReadingProgress {
  bookId: string;
  chapterIndex: number;
  scrollPercent: number;
  updatedAt: number;
}

export interface LocalBookmark {
  id: string;
  bookId: string;
  chapterIndex: number;
  chapterTitle: string;
  scrollPercent: number;
  excerpt: string;
  createdAt: number;
  deletedAt: number | null;
  synced: boolean;
}

class ToshokanDb extends Dexie {
  cachedChapters!: Table<CachedChapter, [string, number]>;
  readingProgress!: Table<LocalReadingProgress, string>;
  bookmarks!: Table<LocalBookmark, string>;

  constructor() {
    super("toshokan");
    this.version(1).stores({
      cachedChapters: "[bookId+chapterIndex], bookId, cachedAt",
      readingProgress: "bookId",
      bookmarks: "id, bookId, synced",
    });
  }
}

export const localDb = new ToshokanDb();
