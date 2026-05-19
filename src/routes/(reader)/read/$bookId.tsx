import { createFileRoute } from "@tanstack/react-router";
import { ReaderPage } from "@/pages/ReaderPage";

export const Route = createFileRoute("/(reader)/read/$bookId")({
  component: ReaderRoute,
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search.ch;
    const num = typeof raw === "string" ? Number(raw) : typeof raw === "number" ? raw : undefined;
    return { ch: typeof num === "number" && !Number.isNaN(num) ? num : undefined };
  },
});

function ReaderRoute() {
  const { bookId } = Route.useParams();
  const { ch } = Route.useSearch();
  return <ReaderPage bookId={bookId} ch={ch} />;
}
