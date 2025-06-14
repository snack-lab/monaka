import appConfig from "../../appConfig.json" with { type: "json" };

const mainCache = appConfig.cache.main.name;
const mainCacheList = appConfig.cache.main.list;

export const addResources = async () => {
  const cache = await caches.open(mainCache);
  const resources = mainCacheList.map((resource) => new Request(resource, { cache: "no-store" }));
  return cache.addAll(resources);
};

export const clearResourcesCaches = async () => {
  const cache = await caches.open(`${appConfig.cache.main.name}`);
  const responses = await cache.matchAll();
  responses.forEach(async response => await cache.delete(new URL(response.url).pathname));
};

export const deleteOldCaches = async (cacheStorageName, cacheList) => {
  const cacheKeepList = new Set(cacheList);
  const cache = await caches.open(cacheStorageName);
  const keyList = await cache.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.has(new URL(key.url).pathname));
  await Promise.all(cachesToDelete.map(async (deleteCache) => await cache.delete(new URL(deleteCache.url).pathname)));
};

export const enableNavigationPreload = async () => {
  if (self.ServiceWorkerRegistration.enableNavigationPreload) {
    await self.ServiceWorkerRegistration.enableNavigationPreload.enable();
  }
};

export const putInCache = async (cacheStorageName, request, responseClone) => {
  const cache = await caches.open(cacheStorageName);
  await cache.put(request, responseClone);
};

export const cacheRequest = async (cacheStorageName, requestUrl) => {
  const cache = await caches.open(cacheStorageName);
  const response = await cache.match(requestUrl);
  return response;
};

export const networkRequest = async (requestUrl) => {
  const request = new Request(requestUrl, { cache: "no-store" });
  const response = await fetch(request);
  return response;
};

export const cacheFirst = async (request) => {
  try {
    const requestURL = new URL(request.url);

    const cachedResponse = await cacheRequest(mainCache, requestURL.pathname);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await networkRequest(requestURL.pathname);
    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
      return networkResponse;
    }

    const headers = new Headers(networkResponse.headers);
    headers.set("Cache-control", "no-store");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Cross-Origin-Resource-Policy", "same-origin");
    headers.set("Cross-Origin-Opener-Policy", "same-origin");
    headers.set("Cross-Origin-Embedder-Policy", "require-corp");

    const additionalResponse = new Response(networkResponse.body, {
      status: networkResponse.status,
      statusText: networkResponse.statusText,
      headers: headers,
    });

    await putInCache(mainCache, request, additionalResponse.clone());
    return additionalResponse;
  } catch (error) {
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

export const sendSubscription = async () => {
  const currentToken = await getPushToken();

  if (!currentToken) {
    throw new Error("No registration token available. Request permission to generate one.");
  }
  await sendPushSubscriptionToBackEnd(currentToken);
};

export const getPushToken = async () => {
  const currentToken = "";
  return currentToken;
};

const sendPushSubscriptionToBackEnd = async (currentToken) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const url = new URL(`${location.origin}`);
  const formData = new FormData();
  formData.append("token", currentToken);

  const request = new Request(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(Object.fromEntries(formData)),
    mode: "same-origin",
    cache: "no-store",
    redirect: "manual",
    signal: AbortSignal.timeout(5000),
  });

  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(response.statusText);
  }
};

export const setBadge = async (count) => {
  if ("setAppBadge" in navigator) {
    try {
      await navigator.setAppBadge(count);
    } catch (error) {
      console.debug("Failed to set app badge:", error);
    }
  }
};

export const clearBadge = async () => {
  if ("clearAppBadge" in navigator) {
    try {
      await navigator.clearAppBadge();
    } catch (error) {
      console.debug("Failed to clear app badge:", error);
    }
  }
};

export const clearNotifications = async () => {
  if ("Notification" in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const notifications = await registration.getNotifications();
      for (const notification of notifications) {
        notification.close();
      }
    } catch (error) {
      console.debug("Failed to clear app notifications:", error);
    }
  }
};
