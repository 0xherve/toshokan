import { createServerFn } from "@tanstack/react-start";
import { eq, count } from "drizzle-orm";
import { requireAdmin } from "../../lib/auth-guard";
import { db } from "../../db";
import { books, users } from "../../../src/db/schema";

export const getAdminStats = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();

    const [bookCounts, userCount] = await Promise.all([
      db
        .select({ status: books.status, count: count() })
        .from(books)
        .groupBy(books.status),
      db.select({ count: count() }).from(users),
    ]);

    const published = bookCounts.find((r) => r.status === "published")?.count ?? 0;
    const draft = bookCounts.find((r) => r.status === "draft")?.count ?? 0;
    const archived = bookCounts.find((r) => r.status === "archived")?.count ?? 0;

    return {
      books: { published, draft, archived, total: published + draft + archived },
      users: userCount[0]?.count ?? 0,
    };
  },
);
