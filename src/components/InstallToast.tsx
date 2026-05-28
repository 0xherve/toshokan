import { IconX } from "@tabler/icons-react";

interface InstallToastProps {
  open: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallToast({ open, onInstall, onDismiss }: InstallToastProps) {
  if (!open) return null;

  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 safe-area-bottom px-4 pb-4">
      <div className="mx-auto max-w-[32rem] rounded-2xl border border-border p-4 shadow-lg bg-surface font-ui">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-foreground">Install Toshokan</div>
            <div className="text-xs mt-1 text-foreground-soft">
              Read offline, anytime.
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg transition-colors text-foreground-muted"
            aria-label="Dismiss"
          >
            <IconX size={16} />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onInstall}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-colors bg-accent text-white"
          >
            Install
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-2 rounded-xl text-xs transition-colors text-foreground-muted"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
