interface InstallToastProps {
  open: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallToast({ open, onInstall, onDismiss }: InstallToastProps) {
  if (!open) return null;

  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 safe-area-bottom px-4 pb-4">
      <div
        className="mx-auto max-w-[32rem] rounded-2xl border p-4 shadow-lg"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Install Watashi</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              A tasteful, personal light novel library—available offline.
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg transition-colors cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Dismiss"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onInstall}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-on-primary)",
              border: "1px solid var(--border)",
            }}
          >
            Download
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
