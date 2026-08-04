// Therabridge push-notification service worker.
// Static file served from /sw.js (copied from frontend/public/).

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    // Non-JSON payload — fall back to empty
  }

  const title = payload.title || "Therabridge";
  const notificationId = payload.data?.notificationId;
  const options = {
    body: payload.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: payload.data || {},
    tag: notificationId || `therabridge-${Date.now()}`,
    vibrate: [100, 50, 100],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const url = notification.data?.url || "/";
  notification.close();

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of allClients) {
        if (
          client.url.startsWith(self.location.origin) &&
          "focus" in client
        ) {
          await client.navigate(url);
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })()
  );
});

self.addEventListener("notificationclose", (event) => {
  event.notification.close();
});
