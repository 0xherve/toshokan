import { createFileRoute } from "@tanstack/react-router";
import { AdminIngestionPage } from "@/pages/AdminIngestionPage";

export const Route = createFileRoute("/(admin)/admin/ingestion")({
  component: AdminIngestionPage,
});
