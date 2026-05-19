import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSessionInfo } from "@server/functions/auth/getSession";

export const Route = createFileRoute("/(reader)")({
  beforeLoad: async ({ location }) => {
    const session = await getSessionInfo();
    if (!session.authenticated) {
      throw redirect({ to: "/auth/signin", search: { redirect: location.href } });
    }
  },
  component: () => <Outlet />,
});
