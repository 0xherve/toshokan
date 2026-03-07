export type BookStatus = "draft" | "published" | "archived";

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  chapterCount: number;
  completion: number;
  status: BookStatus;
  updatedAt: string;
}

export const libraryBooks: LibraryBook[] = [
  {
    id: "book-shadow-slave",
    title: "Shadow Slave",
    author: "Guiltythree",
    chapterCount: 2152,
    completion: 0.67,
    status: "published",
    updatedAt: "2026-03-06",
  },
  {
    id: "book-lord-of-mysteries",
    title: "Lord of the Mysteries",
    author: "Cuttlefish That Loves Diving",
    chapterCount: 1432,
    completion: 0.18,
    status: "published",
    updatedAt: "2026-03-01",
  },
  {
    id: "book-reverend-insanity",
    title: "Reverend Insanity",
    author: "Gu Zhen Ren",
    chapterCount: 2334,
    completion: 0.02,
    status: "draft",
    updatedAt: "2026-02-25",
  },
];

export const adminMetrics = [
  { label: "Active readers (7d)", value: "184" },
  { label: "Book completions (30d)", value: "42" },
  { label: "Avg session", value: "38m" },
  { label: "Install conversion", value: "19.4%" },
];

export const ingestionJobs = [
  {
    id: "job-8213",
    bookTitle: "Shadow Slave - Vol. 13",
    status: "processing",
    submittedBy: "admin@watashi.fun",
    createdAt: "2026-03-07 09:22",
  },
  {
    id: "job-8211",
    bookTitle: "Lord of the Mysteries - Extras",
    status: "done",
    submittedBy: "editor@watashi.fun",
    createdAt: "2026-03-06 21:08",
  },
  {
    id: "job-8205",
    bookTitle: "Reverend Insanity - EPUB import",
    status: "failed",
    submittedBy: "admin@watashi.fun",
    createdAt: "2026-03-05 13:45",
  },
];

export const adminUsers = [
  { id: "u-1", email: "admin@watashi.fun", role: "admin", state: "active" },
  { id: "u-2", email: "reader@watashi.fun", role: "user", state: "active" },
  { id: "u-3", email: "beta@watashi.fun", role: "user", state: "invited" },
];

export const auditEvents = [
  {
    id: "a-198",
    action: "book.publish",
    actor: "admin@watashi.fun",
    target: "Shadow Slave - Vol. 12",
    at: "2026-03-06 18:12",
  },
  {
    id: "a-197",
    action: "user.role.grant",
    actor: "admin@watashi.fun",
    target: "editor@watashi.fun -> admin",
    at: "2026-03-06 16:09",
  },
  {
    id: "a-196",
    action: "ingestion.retry",
    actor: "editor@watashi.fun",
    target: "job-8205",
    at: "2026-03-05 14:02",
  },
];
