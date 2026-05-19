import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "@/pages/AdminUsersPage";

export const Route = createFileRoute("/(admin)/admin/users")({
  component: AdminUsersPage,
});
