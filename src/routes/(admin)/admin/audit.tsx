import { createFileRoute } from "@tanstack/react-router";
import { AdminAuditPage } from "@/pages/AdminAuditPage";

export const Route = createFileRoute("/(admin)/admin/audit")({
  component: AdminAuditPage,
});
