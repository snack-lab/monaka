import appConfig from "../../appConfig.json" with { type: "json" };

const mainCache = appConfig.cache.main.name;
const mainCacheList = appConfig.cache.main.list;

export const addResources = async () => {
  const cache = await caches.open(mainCache);
  const resources = mainCacheList.map((resource) => new Request(resource, { cache: "no-store" }));
  return cache.addAll(resources);
};

export const deleteOldCaches = async (cacheStorageName, cacheList) => {
  const cacheKeepList = new Set(cacheList);
  const cache = await caches.open(cacheStorageName);
  const keyList = await cache.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.has(new URL(key.url).pathname));
  await Promise.all(cachesToDelete.map(async (deleteCache) => await cache.delete(new URL(deleteCache.url).pathname)));
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

    await putInCache(mainCache, request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};
