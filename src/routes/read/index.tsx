import { createFileRoute } from "@tanstack/react-router";
import { ReaderIndexPage } from "../../pages/ReaderIndexPage";

export const Route = createFileRoute("/read/")({
  component: ReaderIndexPage,
});
