import { createFileRoute } from "@tanstack/react-router";
import { AdminBooksPage } from "../../pages/AdminBooksPage";

export const Route = createFileRoute("/admin/books")({
  component: AdminBooksPage,
});
