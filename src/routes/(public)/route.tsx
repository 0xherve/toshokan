import { createFileRoute } from "@tanstack/react-router";
import { ShellLayout } from "@/components/ShellLayout";

export const Route = createFileRoute("/(public)")({
  component: ShellLayout,
});
