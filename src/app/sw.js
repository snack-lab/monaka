import appConfig from "./appConfig.js";
import * as swLib from "./swlib.js";

self.addEventListener('install', event => {
  console.debug(event.type, event);

  event.waitUntil(Promise.all([swLib.addResources(), swLib.addOfflineResources()]));
  // 待機しているService Workerがアクティブになるように強制
  // event.waitUntil(Promise.all([swLib.addResources(), swLib.addOfflineResources(),self.skipWaiting()]));
});

self.addEventListener('activate', event => {
  console.debug(event.type, event);

  event.waitUntil(Promise.all([
    swLib.deleteOldCaches(`${appConfig.mainCacheName}`, `${appConfig.mainCacheList}`),
    swLib.deleteOldCaches(`${appConfig.offlineCacheName}`, `${appConfig.offlineCacheList}`),
    swLib.enableNavigationPreload()
   ]));

  // アクティブなサービスワーカーが自身のスコープ内のすべてのクライアントのコントローラーとして自分自身を設定できる。
  // これにより、このサービスワーカーによって制御されるようになるクライアントのサービスワーカーで"controllerchange"イベントがトリガーされる。
  // サービスワーカーが最初に登録されると、ページは次に読み込まれるまでそれを使用しないが、ページがすぐに制御したい場合
  // event.waitUntil(Promise.all([
  //   swLib.deleteOldCaches(`${appConfig.mainCacheName}`, `${appConfig.mainCacheList}`),
  //   swLib.deleteOldCaches(`${appConfig.offlineCacheName}`, `${appConfig.offlineCacheList}`),
  //   swLib.enableNavigationPreload(),
  //   swLib.clients.claim()
  //  ]));
});

self.addEventListener('fetch', event => {
  console.debug(event.type, event);

  const requestURL = new URL(event.request.url);
  if (requestURL.origin === location.origin) {
    if (event.request.mode === "navigate") {
      event.respondWith(swLib.cacheFirstPreload(event.request,event.preloadResponse));
    } else {
      if (event.request.destination === "video" || event.request.destination === "audio") {
        event.respondWith(swLib.cacheFirstMedia(event.request));
      } else {
        event.respondWith(swLib.cacheFirst(event.request));
      }
    }
  } else {
    console.debug(`fetch response(not origin): `, requestURL);
    event.respondWith(swLib.networkRequest(requestURL.href))
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
    event.waitUntil(Promise.all([swLib.addResources(), swLib.addOfflineResources()]));
  }
});
