useEffect(() => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);

          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }

          if (registration.active) {
            console.log("SW is active");
          }
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    });
  }
}, []);
