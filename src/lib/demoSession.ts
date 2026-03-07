import { useSyncExternalStore } from "react";

export type DemoRole = "guest" | "user" | "admin";

export interface DemoSession {
  role: DemoRole;
  email: string | null;
}

const SESSION_KEY = "wt-demo-session";

const DEFAULT_SESSION: DemoSession = {
  role: "guest",
  email: null,
};

const listeners = new Set<() => void>();

function loadSession(): DemoSession {
  if (typeof window === "undefined") return DEFAULT_SESSION;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return DEFAULT_SESSION;
    const parsed = JSON.parse(raw) as Partial<DemoSession>;
    const role: DemoRole =
      parsed.role === "admin" || parsed.role === "user" ? parsed.role : "guest";
    const email =
      typeof parsed.email === "string" && parsed.email.trim().length > 0
        ? parsed.email.trim()
        : null;
    return { role, email };
  } catch {
    return DEFAULT_SESSION;
  }
}

let sessionState: DemoSession = loadSession();

function persistAndNotify(next: DemoSession) {
  sessionState = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener());
}

export function signIn(role: Exclude<DemoRole, "guest">, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  persistAndNotify({
    role,
    email: normalizedEmail || `${role}@watashi.local`,
  });
}

export function signOut() {
  persistAndNotify(DEFAULT_SESSION);
}

export function getDemoSession() {
  return sessionState;
}

export function isAdmin(session: DemoSession) {
  return session.role === "admin";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useDemoSession() {
  return useSyncExternalStore(subscribe, getDemoSession, getDemoSession);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== SESSION_KEY) return;
    sessionState = loadSession();
    listeners.forEach((listener) => listener());
  });
}
