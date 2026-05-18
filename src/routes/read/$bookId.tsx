import { createFileRoute } from "@tanstack/react-router";
import { ReaderPage } from "../../pages/ReaderPage";

export const Route = createFileRoute("/read/$bookId")({
  component: ReaderPage,
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search.ch;
    const num = typeof raw === "string" ? Number(raw) : typeof raw === "number" ? raw : undefined;
    return { ch: typeof num === "number" && !Number.isNaN(num) ? num : undefined };
  },
});
