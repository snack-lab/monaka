import appConfig from "./appConfig.json" with { type: "json" };
import * as mod from "./js/worker/sw.mjs";

const scope = appConfig.scope;
const mainCache = appConfig.cache.main.name;
const mainCacheList = appConfig.cache.main.list;

self.addEventListener("install", (event) => {
  event.waitUntil(Promise.all([mod.addResources(), self.skipWaiting()]));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      mod.deleteOldCaches(mainCache, mainCacheList),
      mod.enableNavigationPreload(),
      self.clients.claim(),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const requestURL = new URL(event.request.url);
  if (requestURL.origin === location.origin && requestURL.pathname.startsWith(scope)) {
    if (event.request.mode === "navigate") {
      if (requestURL.pathname === "/monaka/offline.html") {
        event.respondWith(mod.cacheFirst(event.request));
      }
    } else {
      // console.debug(event.request.destination);
      if (!requestURL.pathname.includes("/mosha/") && appConfig.cache.main.list.includes(requestURL.pathname)) {
        event.respondWith(mod.cacheFirst(event.request));
      }
    }
  }
});

self.addEventListener("push", (event) => {
  const options = event.data.json();

  const show = async () => {
    await self.registration.showNotification(options.notification.title, {
      body: options.notification.body,
      icon: options.notification.image,
      badge: options.notification.badge,
      tag: options.notification.tag,
      data: options?.data,
    });

    const notifications = await self.registration.getNotifications();
    await swModule.setBadge(notifications.length);
  };

  event.waitUntil(show());
});

self.addEventListener("notificationclick", (event) => {
  const openChat = async () => {
    const clickedNotification = event.notification;
    clickedNotification.close();

    let url = new URL(`${location.origin}${appConfig.scope}`).href;
    if (event.notification?.data?.link) {
      url = new URL(event.notification?.data?.link).href;
    }

    const notifications = await self.registration.getNotifications();
    await swModule.setBadge(notifications.length);

    await clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === url ? (windowClient.focus(), true) : false,
      );
      if (!hadWindowToFocus)
        clients.openWindow(url).then((windowClient) => (windowClient ? windowClient.focus() : null));
    });
  };

  event.waitUntil(openChat());
});

self.addEventListener("notificationclose", (event) => {
  const close = async () => {
    const notifications = await self.registration.getNotifications();
    await swModule.setBadge(notifications.length);
  };

  event.waitUntil(close());
});

self.addEventListener("periodicsync", (event) => {
  const resourceTag = appConfig.periodicSync.tags.resources.name;

  if (event.tag == `${resourceTag}`) {
    event.waitUntil(Promise.all([mod.clearResourcesCaches(), mod.addResources()]));
  }
});
