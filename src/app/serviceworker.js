// Event(install, activate, message, fetch, sync, push)

const MAIN_CACHE = `monacache_0.1.0`;
const OFFLINE_CACHE = `monacache_offline_0.1.0`;
const APP_SCOPE = "/monaka/";

const CACHE_LIST = [
  `${APP_SCOPE}`,
  `${APP_SCOPE}index.html`,
  `${APP_SCOPE}about.html`,
  `${APP_SCOPE}404.html`,
  `${APP_SCOPE}config.json`,
  `${APP_SCOPE}app.webmanifest`,
  `${APP_SCOPE}css/app.css`,
  `${APP_SCOPE}css/base.css`,
  `${APP_SCOPE}js/index.js`,
  `${APP_SCOPE}js/about.js`,
  `${APP_SCOPE}components/header/header.js`,
  `${APP_SCOPE}components/header/header.css`,
  `${APP_SCOPE}components/header/logo/logo.js`,
  `${APP_SCOPE}components/header/logo/logo.css`,
  `${APP_SCOPE}components/header/navi/nav.js`,
  `${APP_SCOPE}components/header/navi/nav.css`,
];

// install
self.addEventListener('install', event => {
  const preCache = async () => {
    console.debug(`add main cache`);
    const cache = await caches.open(`${MAIN_CACHE}`);
    return cache.addAll(CACHE_LIST);
  }

  const offlineCache = async () => {
    console.debug(`add offline cache`);
    const cache = await caches.open(`${OFFLINE_CACHE}`);
    return cache.add(`${APP_SCOPE}offline.html`, { cache: "reload"});
  }

  event.waitUntil(
    (async() => {
      preCache();
      offlineCache();
    })()
  )

  // 待機しているService Workerがアクティブになるように強制
  // self.skipWaiting();
});

// active
self.addEventListener('activate', event => {
  console.debug('activate....');

  // 古いキャッシュの削除
  const cacheKeepList = new Set([`${MAIN_CACHE}`, `${OFFLINE_CACHE}`]);

  event.waitUntil(
    (async () => {
      caches.keys().then(keyList => {
        return Promise.all(keyList.map(key => {
          if (!cacheKeepList.has(key)) {
          console.debug(`Delete old cache`, key);
          return caches.delete(key);
          }
        }));
      })

      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  )

  // アクティブなサービスワーカーが自身のスコープ内のすべてのクライアントのコントローラーとして自分自身を設定できる。
  // これにより、このサービスワーカーによって制御されるようになるクライアントのサービスワーカーで"controllerchange"イベントがトリガーされる。
  // サービスワーカーが最初に登録されると、ページは次に読み込まれるまでそれを使用しないが、ページがすぐに制御したい場合
  // clients.claim();
});

// fetch
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin == location.origin) {
    // ナビゲーション リクエストは、ブラウザのロケーション バーにURL を入力したり、
    // window.locationと対話したり、リンクをクリックしてあるウェブページから別のウェブページにアクセスしたりするときに発生する。
    // iframeのsrc要求でも発生する。
    if (event.request.mode === "navigate") {
      console.debug("navigate...", event.request);

      event.respondWith((async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            console.debug("Preload Response", preloadResponse);
          return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.debug("Fetch failed; returning offline page instead.", error);

          const cache = await caches.open(OFFLINE_CACHE);
          const cachedResponse = await cache.match(`${APP_SCOPE}offline.html`);
          return cachedResponse;
        }
      })())
    } else if (event.request.destination === "video") {
      event.respondWith((async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          console.debug(`cache match video response: `, event.request)
          return cachedResponse;
        }

        if ('BackgroundFetchManager' in self) {
          const bgFetch = await registration.backgroundFetch.get(url.pathname)
          console.debug("backgroundFetch: ", bgFetch)

          if (bgFetch) {
            const record = await bgFetch.match(event.request)
            console.debug("backgroundFetch record: ", record)
            if (record) {
              return await record.responseReady
            }
          }
        }

        return await fetch(event.request);
      })())
    } else {
      event.respondWith((async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          // 利用可能なキャッシュと一致する場合
            console.debug(`cache match response: `, event.request)
            return cachedResponse;
        }

        const networkResponse = await fetch(event.request);
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
        }

        const responseClone = await networkResponse.clone();
        const cache = await caches.open(MAIN_CACHE);
        await cache.put(event.request, responseClone);

        console.debug(`fetch network response: `, event.request)
        return networkResponse;
      })())
    }
  } else {
    event.respondWith((async () => {
    console.debug(`fetch response(not origin): `, event.request);
      const networkResponse = await fetch(event.request);
      return networkResponse;
    })())
  }
})

// background fetch
self.addEventListener('backgroundfetchsuccess', event => {
  event.waitUntil((async () => {
    try {
      const id = event.registration.id
      const cache = await caches.open(MAIN_CACHE)
      const records = await event.registration.matchAll();
      console.debug(id, records);

      const promises = records.map(async (record) => {
        const request = record.request;
        const response = await record.responseReady;
        console.debug(request, response)
        await cache.put(request, response);
      });
      await Promise.all(promises);

      await event.updateUI({ title: id })
    } catch (err) {
      console.error(err);
      await event.updateUI({ title: `download failed ${event.registration.id}` })
    }
  })());
})

self.addEventListener('backgroundfetchfail', event => {
  console.error("backgroundfetch fail: ", event);

  event.waitUntil((async () => {
    try {
      const id = event.registration.id
      const cache = await caches.open(MAIN_CACHE);
      const records = await event.registration.matchAll();
      console.debug(id, records);

      const promises = records.map(async (record) => {
        const request = record.request;
        const response = await record.responseReady.catch(() => undefined);
        if (response && response.ok) {
          console.debug(request, response)
          await cache.put(request, response);
        }
      });
      await Promise.all(promises);
    } finally {
      event.updateUI({ title: `download failed ${event.registration.id}` })
    }
  })());
})

self.addEventListener('backgroundfetchabort', event => {
  console.error("backgroundfetch abort: ", event);
})

self.addEventListener('backgroundfetchclick', event => {
  // download タスクをクリックした場合
  console.debug("backgroundfetch click: ", event);

  const bgFetch = event.registration;
  if (bgFetch.result === 'success') {
    clients.openWindow('/');
  } else {
    clients.openWindow('/');
  }
})
