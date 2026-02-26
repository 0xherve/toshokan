import { useState, useCallback, useEffect } from "react";
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

type Panel = "none" | "chapters" | "settings" | "bookmarks";

export default function App() {
  const { isLoading, error, chapters, toc, totalChapters } =
    useEpubReader(EPUB_URL);
  const { theme, setTheme } = useTheme();
  const {
    currentChapter,
    setCurrentChapter,
    goNext,
    goPrev,
    scrollPercent,
    bookProgress,
    handleScroll,
    scrollContainerRef,
  } = useReadingProgress(totalChapters);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  useWakeLock();

  const [uiVisible, setUiVisible] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>("none");
  const [fontSize, setFontSizeState] = useState(() => getSettings().fontSize);

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
    const div = document.createElement("div");
    div.innerHTML = ch.html;
    const text = div.textContent || "";
    const charPos = Math.floor(text.length * scrollPercent);
    const start = Math.max(0, charPos - 60);
    const excerpt = text.slice(start, start + 120).trim();
    addBookmark(currentChapter, ch.title, scrollPercent, excerpt || ch.title);
    setActivePanel("none");
  }, [chapters, currentChapter, scrollPercent, addBookmark]);

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
          Make sure <code>shadow-slave.epub</code> is placed in{" "}
          <code>public/books/</code>
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
        chapterTitle={currentChapterData.title}
        visible={uiVisible}
        onMenuClick={() => openPanel("chapters")}
        onBookmarkClick={handleAddBookmark}
      />

      <BottomBar
        visible={uiVisible}
        chapterTitle={currentChapterData.title}
        chapterIndex={currentChapter}
        totalChapters={totalChapters}
        bookProgress={bookProgress}
        onSettingsClick={() => openPanel("settings")}
      />

      <ChapterNav
        open={activePanel === "chapters"}
        onClose={closePanel}
        toc={toc}
        currentChapter={currentChapter}
        totalChapters={totalChapters}
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
        theme={theme}
        onThemeChange={setTheme}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
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
