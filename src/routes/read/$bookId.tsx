import { createFileRoute } from "@tanstack/react-router";
import { ReaderPage } from "../../pages/ReaderPage";

export const Route = createFileRoute("/read/$bookId")({
  component: ReaderPage,
  validateSearch: (search: Record<string, unknown>) => ({
    ch: typeof search.ch === "number" ? search.ch : undefined,
  }),
});
