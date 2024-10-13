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
  self.registration.showNotification(options.notification.title, {
    body: options.notification.body,
    data: options.notification.data,
  });
});

self.addEventListener("notificationclick", (event) => {
  const clickedNotification = event.notification;
  const url = event.notification?.data?.link;
  clickedNotification.close();

  const promiseChain = clients.openWindow(url);
  event.waitUntil(promiseChain);
});

self.addEventListener("periodicsync", (event) => {
  const resourceTag = appConfig.periodicSync.tags.resources.name;

  if (event.tag == `${resourceTag}`) {
    event.waitUntil(Promise.all([mod.clearResourcesCaches(), mod.addResources()]));
  }
});
