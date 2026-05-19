import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "@/pages/auth/SignInPage";

export const Route = createFileRoute("/auth/signin")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: SignInRoute,
});

function SignInRoute() {
  const { redirect } = Route.useSearch();
  return <SignInPage redirect={redirect} />;
}

