import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSessionInfo } from "@server/functions/auth/getSession";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/(admin)")({
  beforeLoad: async ({ location }) => {
    const session = await getSessionInfo();
    if (!session.authenticated) {
      throw redirect({ to: "/auth/signin", search: { redirect: location.href } });
    }
    if (session.role !== "admin") {
      throw redirect({ to: "/library" });
    }
  },
  component: () => (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
});
