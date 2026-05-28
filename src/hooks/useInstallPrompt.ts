import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "../lib/constants";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallToast, setShowInstallToast] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEYS.INSTALL_DISMISSED) === "1";
    if (dismissed) return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setShowInstallToast(true);
    };

    const onAppInstalled = () => {
      localStorage.setItem(STORAGE_KEYS.INSTALL_DISMISSED, "1");
      setShowInstallToast(false);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    localStorage.setItem(STORAGE_KEYS.INSTALL_DISMISSED, "1");
    setShowInstallToast(false);
    setInstallPrompt(null);
  }, [installPrompt]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.INSTALL_DISMISSED, "1");
    setShowInstallToast(false);
    setInstallPrompt(null);
  }, []);

  return {
    showInstallToast: showInstallToast && !!installPrompt,
    handleInstall,
    handleDismiss,
  };
}
