const appConfig = {
  appScope: '/monaka/',
  appVersion: "0.0.1",
  mainCacheName: 'monacahe_v0.1.0',
  offlineCacheName: 'monacache_offline_v0.1.0',
  mediaCacheName: 'monacache_media_v1.0.0',
  mainCacheList: [
   '/monaka/',
   '/monaka/components/header/header.js',
   '/monaka/components/header/header.css',
   '/monaka/components/header/logo/logo.js',
   '/monaka/components/header/logo/logo.css',
   '/monaka/components/header/navi/nav.js',
   '/monaka/components/header/navi/nav.css',
   '/monaka/css/app.css',
   '/monaka/css/base.css',
   '/monaka/js/index.js',
   '/monaka/js/about.js',
   '/monaka/modules/env.js',
   '/monaka/modules/navigation.js',
   '/monaka/modules/sw.js',
   '/monaka/modules/wakelock.js',
   '/monaka/about.html',
   '/monaka/app.js',
   '/monaka/app.webmanifest',
   '/monaka/appConfig.js',
   '/monaka/apple-touch-icon.png',
   '/monaka/favicon.ico',
   '/monaka/icon.svg',
   '/monaka/importmap.json',
   '/monaka/index.html',
   '/monaka/robots.txt',
  ],
  offlineCacheList: [
    '/monaka/offline.html'
  ],
  periodicSync: {
    tags: {
      resources: {
        name: "get-resources-sync24h",
        minInterval: 24 * 60 * 60 * 1000
      }
    }
  },
}

export default appConfig;
