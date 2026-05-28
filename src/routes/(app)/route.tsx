import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSessionInfo } from "@server/functions/auth";
import { ShellLayout } from "@/components/ShellLayout";

export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ location }) => {
    const session = await getSessionInfo();
    if (!session.authenticated) {
      throw redirect({ to: "/auth/signin", search: { redirect: location.href } });
    }
  },
  component: ShellLayout,
});
