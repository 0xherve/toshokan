import type { MouseEvent, RefObject, TouchEvent } from "react";
import { useRef, useCallback } from "react";
import type { ChapterData } from "../lib/constants";

interface ReaderProps {
  chapter: ChapterData;
  fontSize: number;
  currentChapter: number;
  totalChapters: number;
  onNext: () => void;
  onPrev: () => void;
  onScroll: () => void;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  onToggleUI: () => void;
}

export function Reader({
  chapter,
  fontSize,
  currentChapter,
  totalChapters,
  onNext,
  onPrev,
  onScroll,
  scrollContainerRef,
  onToggleUI,
}: ReaderProps) {
  const lastTapRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number; width: number } | null>(
    null,
  );
  const touchLastRef = useRef<{ x: number; y: number } | null>(null);

  const handleTap = useCallback(
    (e: MouseEvent) => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;

      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a")) return;

      const now = Date.now();
      if (now - lastTapRef.current < 300) return;
      lastTapRef.current = now;

      onToggleUI();
    },
    [onToggleUI],
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const point = {
      x: touch.clientX,
      y: touch.clientY,
      width: e.currentTarget.clientWidth,
    };
    touchStartRef.current = point;
    touchLastRef.current = point;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    touchLastRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(() => {
    const start = touchStartRef.current;
    const last = touchLastRef.current;
    touchStartRef.current = null;
    touchLastRef.current = null;
    if (!start || !last) return;

    const dx = last.x - start.x;
    const dy = last.y - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const edgeThreshold = start.width * 0.5;
    const isEdge = start.x <= edgeThreshold || start.x >= start.width - edgeThreshold;
    if (!isEdge) return;
    if (absDx < 60 || absDx < absDy * 1.5) return;

    if (dx < 0) {
      onNext();
    } else {
      onPrev();
    }
  }, [onNext, onPrev]);

  return (
    <div
      ref={scrollContainerRef}
      className="fixed inset-0 overflow-y-auto"
      style={{ backgroundColor: "var(--bg-reader)" }}
      onScroll={onScroll}
      onClick={handleTap}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <article
        className="reader-content mx-auto px-5 py-16 max-w-[38em]"
        style={{ fontSize: `${fontSize}px` }}
      >
        <h1
          className="text-2xl font-bold mb-8 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          {chapter.title}
        </h1>

        <div dangerouslySetInnerHTML={{ __html: chapter.html }} />

        <div
          className="flex gap-4 mt-16 mb-8 pt-8"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {currentChapter > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
              }}
            >
              &larr; Previous
            </button>
          )}
          {currentChapter < totalChapters - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-on-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Next &rarr;
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
