import { createFileRoute } from "@tanstack/react-router";
import { BookDetailPage } from "@/pages/BookDetailPage";

export const Route = createFileRoute("/(public)/books/$bookSlug")({
  component: BookSlugRoute,
});

function BookSlugRoute() {
  const { bookSlug } = Route.useParams();
  return <BookDetailPage bookSlug={bookSlug} />;
}
