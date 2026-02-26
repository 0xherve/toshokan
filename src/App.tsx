import { useState, useCallback, useEffect, useMemo } from "react";
import { useEpubReader } from "./hooks/useEpubReader";
import { useTheme } from "./hooks/useTheme";
import { useReadingProgress } from "./hooks/useReadingProgress";
import { useBookmarks } from "./hooks/useBookmarks";
import { useWakeLock } from "./hooks/useWakeLock";
import { getSettings, saveSettings } from "./lib/storage";
import { EPUB_URL } from "./lib/constants";
import type { Bookmark } from "./lib/constants";
import { LoadingScreen } from "./components/LoadingScreen";
import { Reader } from "./components/Reader";
import { TopBar } from "./components/TopBar";
import { BottomBar } from "./components/BottomBar";
import { ChapterNav } from "./components/ChapterNav";
import { SettingsPanel } from "./components/SettingsPanel";
import { BookmarkList } from "./components/BookmarkList";
import { ThemePanel } from "./components/ThemePanel";

type Panel = "none" | "chapters" | "settings" | "bookmarks" | "theme";

export default function App() {
  const { isLoading, error, chapters, totalChapters, bookTitle } =
    useEpubReader(EPUB_URL);
  const { theme, setTheme } = useTheme();
  const {
    currentChapter,
    setCurrentChapter,
    goNext,
    goPrev,
    scrollPercent,
    handleScroll,
    scrollContainerRef,
  } = useReadingProgress(totalChapters);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  useWakeLock();

  const [uiVisible, setUiVisible] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>("none");
  const [fontSize, setFontSizeState] = useState(() => getSettings().fontSize);
  const [chapterQuery, setChapterQuery] = useState("");
  const [chapterRange, setChapterRange] = useState(0);

  const chapterRangesCount = useMemo(() => {
    if (totalChapters === 0) return 1;
    return Math.ceil(totalChapters / 100);
  }, [totalChapters]);

  useEffect(() => {
    if (totalChapters === 0) return;
    const currentRange = Math.floor(currentChapter / 100);
    setChapterRange(Math.min(currentRange, Math.max(0, chapterRangesCount - 1)));
  }, [currentChapter, totalChapters, chapterRangesCount]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleUI = useCallback(() => {
    setUiVisible((v) => !v);
  }, []);

  const openPanel = useCallback((panel: Panel) => {
    setActivePanel(panel);
    setUiVisible(false);
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel("none");
  }, []);


  const handleFontSizeChange = useCallback((size: number) => {
    setFontSizeState(size);
    const settings = getSettings();
    saveSettings({ ...settings, fontSize: size });
  }, []);


  const handleAddBookmark = useCallback(() => {
    if (chapters.length === 0) return;
    const ch = chapters[currentChapter];
    if (!ch) return;
    const existing = bookmarks.find((bm) => bm.chapterIndex === currentChapter);
    if (existing) {
      removeBookmark(existing.id);
      setActivePanel("none");
      return;
    }
    const div = document.createElement("div");
    div.innerHTML = ch.html;
    const text = div.textContent || "";
    const charPos = Math.floor(text.length * scrollPercent);
    const start = Math.max(0, charPos - 60);
    const excerpt = text.slice(start, start + 120).trim();
    addBookmark(currentChapter, ch.title, scrollPercent, excerpt || ch.title);
    setActivePanel("none");
  }, [
    chapters,
    currentChapter,
    scrollPercent,
    addBookmark,
    bookmarks,
    removeBookmark,
  ]);

  const handleSelectBookmark = useCallback(
    (bookmark: Bookmark) => {
      setCurrentChapter(bookmark.chapterIndex);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            const el = scrollContainerRef.current;
            const maxScroll = el.scrollHeight - el.clientHeight;
            el.scrollTop = maxScroll * bookmark.scrollPercent;
          }
        });
      });
    },
    [setCurrentChapter, scrollContainerRef],
  );

  const handleGoNext = useCallback(() => {
    goNext();
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    });
  }, [goNext, scrollContainerRef]);

  const handleGoPrev = useCallback(() => {
    goPrev();
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    });
  }, [goPrev, scrollContainerRef]);

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center"
        style={{
          backgroundColor: "var(--bg-app)",
          color: "var(--text-primary)",
        }}
      >
        <div className="text-xl font-bold">Failed to load book</div>
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {error}
        </div>
        <div className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
          Check <code>VITE_EPUB_URL</code> or the default blob URL.
        </div>
      </div>
    );
  }

  const currentChapterData = chapters[currentChapter];
  if (!currentChapterData) return null;

  return (
    <>
      <Reader
        chapter={currentChapterData}
        fontSize={fontSize}
        currentChapter={currentChapter}
        totalChapters={totalChapters}
        onNext={handleGoNext}
        onPrev={handleGoPrev}
        onScroll={handleScroll}
        scrollContainerRef={scrollContainerRef}
        onToggleUI={toggleUI}
      />


      <TopBar
        chapterTitle={bookTitle}
        visible={true}
        onMenuClick={() => openPanel("chapters")}
        onBookmarkClick={handleAddBookmark}
        theme={theme}
        onThemeClick={() => openPanel("theme")}
        isBookmarked={bookmarks.some((bm) => bm.chapterIndex === currentChapter)}
      />

      <BottomBar
        visible={uiVisible}
        chapterTitle={currentChapterData.title}
        chapterIndex={currentChapter}
        totalChapters={totalChapters}
        chapterProgress={scrollPercent}
        onSettingsClick={() => openPanel("settings")}
      />

      <ChapterNav
        open={activePanel === "chapters"}
        onClose={closePanel}
        chapters={chapters}
        bookmarks={bookmarks}
        currentChapter={currentChapter}
        totalChapters={totalChapters}
        query={chapterQuery}
        onQueryChange={setChapterQuery}
        selectedRange={chapterRange}
        onRangeChange={setChapterRange}
        onSelectChapter={(index) => {
          const chapterIdx = chapters.findIndex((ch) => ch.index === index);
          if (chapterIdx >= 0) {
            setCurrentChapter(chapterIdx);
            requestAnimationFrame(() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
              }
            });
          }
          closePanel();
        }}
      />

      <SettingsPanel
        open={activePanel === "settings"}
        onClose={closePanel}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
      />

      <ThemePanel
        open={activePanel === "theme"}
        onClose={closePanel}
        theme={theme}
        onThemeChange={setTheme}
      />

      <BookmarkList
        open={activePanel === "bookmarks"}
        onClose={closePanel}
        bookmarks={bookmarks}
        onSelectBookmark={handleSelectBookmark}
        onRemoveBookmark={removeBookmark}
      />
    </>
  );
}
