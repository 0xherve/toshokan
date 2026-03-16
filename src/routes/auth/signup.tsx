import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "../../pages/auth/SignUpPage";

export const Route = createFileRoute("/auth/signup")({
  component: SignUpPage,
});

