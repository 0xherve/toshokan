/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { createAuthClient } from "better-auth/react";

export type AppRole = "guest" | "user" | "admin";

interface AuthContextValue {
  isLoading: boolean;
  role: AppRole;
  email: string | null;
  error: string | null;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signUpWithPassword: (
    name: string,
    email: string,
    password: string,
  ) => Promise<string | null>;
  signOut: () => Promise<string | null>;
}

const authBaseURL =
  import.meta.env.VITE_AUTH_BASE_URL || window.location.origin;

const authClient = createAuthClient({
  baseURL: authBaseURL,
});

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({
      email: email.trim().toLowerCase(),
      password,
    });
    return error?.message ?? null;
  };

  const signUpWithPassword = async (
    name: string,
    email: string,
    password: string,
  ) => {
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    return error?.message ?? null;
  };

  const signOut = async () => {
    const { error } = await authClient.signOut();
    return error?.message ?? null;
  };

  const value = useMemo<AuthContextValue>(() => {
    const user = session.data?.user as { email?: string; role?: string } | undefined;
    const normalizedRole =
      user?.role === "admin" ? "admin" : session.data?.session ? "user" : "guest";

    return {
      isLoading: session.isPending || session.isRefetching,
      role: normalizedRole,
      email: user?.email ?? null,
      error: session.error?.message ?? null,
      signInWithPassword,
      signUpWithPassword,
      signOut,
    };
  }, [session.data?.session, session.data?.user, session.error?.message, session.isPending, session.isRefetching]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
