"use client";
import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registered:", registration);

            // Force it to take control immediately
            if (registration.waiting) {
              registration.waiting.postMessage({ type: "SKIP_WAITING" });
            }

            // Reload when new SW takes control
            let refreshing;
            navigator.serviceWorker.addEventListener("controllerchange", () => {
              if (refreshing) return;
              refreshing = true;
              window.location.reload();
            });
          })
          .catch((err) => {
            console.error("Service Worker registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
