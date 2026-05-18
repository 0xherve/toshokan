import { useEffect } from "react";

type WakeLockSentinel = {
  release: () => Promise<void>;
};

export function useWakeLock() {
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    const request = async () => {
      try {
        if ("wakeLock" in navigator) {
          // Release previous lock before requesting a new one
          if (wakeLock) {
            await wakeLock.release();
            wakeLock = null;
          }
          const nav = navigator as Navigator & {
            wakeLock: { request: (type: "screen") => Promise<WakeLockSentinel> };
          };
          wakeLock = await nav.wakeLock.request("screen");
        }
      } catch {
        /* not supported or denied */
      }
    };

    request();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") request();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      wakeLock?.release();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);
}
