import appConfig from "./appConfig.js";
import * as swlib from "./swlib.js";

const addResources = async () => {
  const cache = await caches.open(`${appConfig.mainCacheName}`);
  return cache.addAll(appConfig.mainCacheList);
}

const addOfflineResources = async () => {
  const cache = await caches.open(`${appConfig.offlineCacheName}`);
  return cache.add(`${appConfig.appScope}offline.html`, { cache: "reload"});
}



self.addEventListener('install', event => {
  console.debug(event.type, event);

  event.waitUntil(Promise.all([addResources(), addOfflineResources()]));
  // 待機しているService Workerがアクティブになるように強制
  // event.waitUntil(Promise.all([addResources(), addOfflineResources(),self.skipWaiting()]));
});

self.addEventListener('activate', event => {
  console.debug(event.type, event);

  const deleteOldCaches = async (cacheStorageName, cacheList) => {
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

  const enableNavigationPreload = async () => {
    if (self.ServiceWorkerRegistration.enableNavigationPreload) {
      await self.ServiceWorkerRegistration.enableNavigationPreload.enable();
    }
  }

  // 古いキャッシュの削除
  event.waitUntil(Promise.all([
    deleteOldCaches(`${appConfig.mainCacheName}`, `${appConfig.mainCacheList}`),
    deleteOldCaches(`${appConfig.offlineCacheName}`, `${appConfig.offlineCacheList}`),
    enableNavigationPreload()
   ]));

  // アクティブなサービスワーカーが自身のスコープ内のすべてのクライアントのコントローラーとして自分自身を設定できる。
  // これにより、このサービスワーカーによって制御されるようになるクライアントのサービスワーカーで"controllerchange"イベントがトリガーされる。
  // サービスワーカーが最初に登録されると、ページは次に読み込まれるまでそれを使用しないが、ページがすぐに制御したい場合
  // event.waitUntil(Promise.all([
  //   deleteOldCaches(`${appConfig.mainCacheName}`, `${appConfig.mainCacheList}`),
  //   deleteOldCaches(`${appConfig.offlineCacheName}`, `${appConfig.offlineCacheList}`),
  //   enableNavigationPreload(),
  //   clients.claim()
  //  ]));
});

self.addEventListener('fetch', event => {
  console.debug(event.type, event);

  const putInCache = async (cacheStorageName, request, responseClone) => {
    const cache = await caches.open(cacheStorageName);
    await cache.put(request, responseClone);
  }

  const cacheRequest = async (cacheStorageName, requestUrl) => {
    const cache = await caches.open(cacheStorageName);
    const response = await cache.match(requestUrl);
    return response;
  }

  const networkRequest = async (requestUrl) => {
    const response = await fetch(requestUrl);
    return response;
  }

  const backgroundFetchRequest = async (requestUrl) => {
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

  const cacheFirstPreload = async (request, preloadResponsePromise) => {
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

  const cacheFirst = async (request) => {
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

  const cacheFirstMedia = async (request) => {
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

  const requestURL = new URL(event.request.url);
  if (requestURL.origin === location.origin) {
    if (event.request.mode === "navigate") {
      event.respondWith(cacheFirstPreload(event.request,event.preloadResponse));
    } else {
      if (event.request.destination === "video" || event.request.destination === "audio") {
        event.respondWith(cacheFirstMedia(event.request));
      } else {
        event.respondWith(cacheFirst(event.request));
      }
    }
  } else {
    console.debug(`fetch response(not origin): `, requestURL);
    event.respondWith(networkRequest(requestURL.href))
  }

})

self.addEventListener('backgroundfetchsuccess', event => {
  console.debug(event.type, event);

  event.waitUntil((async () => {
    try {
      const id = event.registration.id;
      // const downloaded = event.registration.downloaded;

      const cache = await caches.open(`${appConfig.videoCache}`);
      const records = await event.registration.matchAll();

      const promises = records.map(async (record) => {
        const request = record.request;
        const response = await record.responseReady;
        await cache.put(request, response);
      })
      await Promise.all(promises);

      event.updateUI({ title: "downloaded!"})
    } catch {
      event.updateUI({ title: "download failed"});
    }
  })());
})

self.addEventListener('backgroundfetchfail', event => {
  console.debug(event.type, event);

  event.waitUntil((async () => {
    try {
      const id = event.registration.id;
      // const downloaded = event.registration.downloaded;

      const cache = await caches.open(`${appConfig.videoCache}`);
      const records = await event.registration.matchAll();

      const promises = records.map(async (record) => {
        const request = event.request;
        const response = await record.responseReady.catch(() => undefined);
        if (response && response.ok) {
          await cache.put(request, response);
        }
      })

      await Promise.add(promises);
    } catch (error) {
      event.updateUI({ title: "download failed"});
    }
  })());
})

self.addEventListener('backgroundfetchabort', event => {
  console.debug(event.type, event);
})

self.addEventListener('backgroundfetchclick', event => {
  console.debug(event.type, event);

  clients.openWindow('/');
})

self.addEventListener('periodicsync', (event) => {
  console.debug(event.type, event);

  if (event.tag == `${appConfig.periodicSync.tags.resources.name}`) {
    event.waitUntil(Promise.all([addResources(), addOfflineResources()]));
  }
});
