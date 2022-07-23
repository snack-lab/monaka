import appConfig from "./appConfig.js";

export const addResources = async () => {
  const cache = await caches.open(`${appConfig.mainCacheName}`);
  return cache.addAll(appConfig.mainCacheList);
}

export const addOfflineResources = async () => {
  const cache = await caches.open(`${appConfig.offlineCacheName}`);
  return cache.add(`${appConfig.appScope}offline.html`, { cache: "reload"});
}

export const deleteOldCaches = async (cacheStorageName, cacheList) => {
  const cacheKeepList = new Set(cacheList);
  const cache = await caches.open(cacheStorageName);
  const keyList = await cache.keys();
  const cachesToDelete = keyList.filter(key => {
    return !cacheKeepList.has(new URL(key.url).pathname);
  });
  await Promise.all(cachesToDelete.map(deleteCache => {
    return cache.delete(deleteCache);
  }));
}

export const enableNavigationPreload = async () => {
  if (self.ServiceWorkerRegistration.enableNavigationPreload) {
    await self.ServiceWorkerRegistration.enableNavigationPreload.enable();
  }
}

export const putInCache = async (cacheStorageName, request, responseClone) => {
  const cache = await caches.open(cacheStorageName);
  await cache.put(request, responseClone);
}

export const cacheRequest = async (cacheStorageName, requestUrl) => {
  const cache = await caches.open(cacheStorageName);
  const response = await cache.match(requestUrl);
  return response;
}

export const networkRequest = async (requestUrl) => {
  const response = await fetch(requestUrl);
  return response;
}

export const backgroundFetchRequest = async (requestUrl) => {
  if ('BackgroundFetchManager' in self) {
    const bgFetch = await registration.backgroundFetch.get(requestUrl)
    if (bgFetch) {
      const record = await bgFetch.match(requestUrl)
      if (record) {
        return await record.responseReady
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export const cacheFirstPreload = async (request, preloadResponsePromise) => {
  try {
    // cache
    const cachedResponse = await cacheRequest(`${appConfig.mainCacheName}`, request);
    if (cachedResponse) return cachedResponse;

    // preload
    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
      await putInCache(`${appConfig.mainCacheName}`, request, preloadResponse.clone())
      return preloadResponse;
    }

    // network
    const networkResponse = await networkRequest(request);
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(appConfig.offlineCacheName);
    const cachedResponse = await cache.match(`/monaka/offline.html`);
    if (cachedResponse) return cachedResponse;

    return new Response("Network error happened", {
      status: 408,
      headers: { 'Content-Type': "text/plain" }
    })
  }
}

export const cacheFirst = async (request) => {
  try {
    const requestURL = new URL(request.url);
    // cache
    const cachedResponse = await cacheRequest(`${appConfig.mainCacheName}`, requestURL.pathname);
    if (cachedResponse) return cachedResponse;

    // network
    const networkResponse = await networkRequest(requestURL.pathname);
    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
      return networkResponse;
    }

    await putInCache(`${appConfig.mainCacheName}`, request, networkResponse.clone())
    return networkResponse;
  } catch (error) {
    return new Response("Network error happened", {
      status: 408,
      headers: { 'Content-Type': "text/plain" }
    })
  }
}

export const cacheFirstMedia = async (request) => {
  try {
    const requestURL = new URL(request.url);

    // cache
    const cachedResponse = await cacheRequest(`${appConfig.mediaCacheName}`, requestURL.pathname);
    if (cachedResponse) return cachedResponse;

    // background fetch
    const backgroundFetchResponse = await backgroundFetchRequest(requestURL.pathname);
    if (backgroundFetchResponse) return backgroundFetchResponse;

    // network
    const networkResponse = await networkRequest(requestURL.pathname);
    return networkResponse;
  } catch (error) {
    return new Response("Network error happened", {
      status: 408,
      headers: { 'Content-Type': "text/plain" }
    })
  }
}
