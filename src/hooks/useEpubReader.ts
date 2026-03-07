import { useState, useEffect, useCallback, useRef } from "react";
import ePub from "epubjs";
import type Book from "epubjs/types/book";
import type Section from "epubjs/types/section";
import type { ChapterData, TocItem } from "../lib/constants";

interface UseEpubReaderReturn {
  isLoading: boolean;
  error: string | null;
  chapters: ChapterData[];
  toc: TocItem[];
  totalChapters: number;
  bookTitle: string;
}

type NavigationTocItem = {
  label: string;
  href: string;
  subitems?: NavigationTocItem[];
};

export function useEpubReader(url: string): UseEpubReaderReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [bookTitle, setBookTitle] = useState("");
  const bookRef = useRef<Book | null>(null);

  const loadBook = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const book = ePub(url);
      bookRef.current = book;

      await book.ready;

      const metadata = (book as unknown as { packaging?: { metadata?: unknown } })
        .packaging?.metadata as { title?: string } | undefined;
      const title = metadata?.title?.trim();
      setBookTitle(title || "Untitled Book");

      const normalizeHref = (href: string) =>
        href.split("#")[0].replace(/^\.\//, "").toLowerCase();

      const tocItems: TocItem[] = [];
      const collectTocItems = (items: NavigationTocItem[]) => {
        items.forEach((item) => {
          const spineItem = book.spine.get(item.href);
          tocItems.push({
            label: item.label.trim(),
            href: normalizeHref(item.href),
            spineIndex: spineItem ? spineItem.index : -1,
          });

          if (item.subitems && item.subitems.length > 0) {
            collectTocItems(item.subitems);
          }
        });
      };

      const navigation = book.navigation;
      if (navigation?.toc) {
        collectTocItems(navigation.toc as NavigationTocItem[]);
      }
      setToc(tocItems);

      const spineItems: Section[] = (
        book.spine as unknown as { spineItems: Section[] }
      ).spineItems;

      if (!spineItems || spineItems.length === 0) {
        setError("No chapters found in this EPUB");
        setIsLoading(false);
        return;
      }

      const loadedChapters: ChapterData[] = [];

      for (const item of spineItems) {
        try {
          await item.load(book.load.bind(book));

          let html = "";

          if (item.document && item.document.body) {
            html = item.document.body.innerHTML;
          } else if (item.output) {
            html = item.output;
          }

          html = html.replace(
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            "",
          );

          const normalizedItemHref = normalizeHref(item.href);
          const tocEntry =
            tocItems.find((t) => t.spineIndex === item.index) ||
            tocItems.find((t) => t.href === normalizedItemHref);
          let title = tocEntry?.label || "";

          if (!title) {
            const headingMatch = html.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
            if (headingMatch) {
              title = headingMatch[1].replace(/<[^>]+>/g, "").trim();
            }
          }

          if (!title) {
            title = `Chapter ${item.index + 1}`;
          }

          if (html.trim().length > 0) {
            loadedChapters.push({
              href: item.href,
              html,
              title,
              index: item.index,
            });
          }

          item.unload();
        } catch (e) {
          console.warn(`Failed to load spine item ${item.index}:`, e);
        }
      }

      if (loadedChapters.length === 0) {
        setError("Could not extract any chapter content from this EPUB");
        setIsLoading(false);
        return;
      }

      setChapters(loadedChapters);
      setIsLoading(false);
    } catch (err) {
      console.error("EPUB load error:", err);
      setError(err instanceof Error ? err.message : "Failed to load book");
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    loadBook();
    return () => {
      if (bookRef.current) {
        bookRef.current.destroy();
        bookRef.current = null;
      }
    };
  }, [loadBook]);

  return {
    isLoading,
    error,
    chapters,
    toc,
    totalChapters: chapters.length,
    bookTitle,
  };
}
