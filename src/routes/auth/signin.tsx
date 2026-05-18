import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "../../pages/auth/SignInPage";

export const Route = createFileRoute("/auth/signin")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: () => {
    return <SignInPage />;
  },
});

