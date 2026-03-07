import { createFileRoute } from "@tanstack/react-router";
import { ReaderPage } from "../../pages/ReaderPage";

export const Route = createFileRoute("/reader/$bookId")({
  component: ReaderPage,
});
