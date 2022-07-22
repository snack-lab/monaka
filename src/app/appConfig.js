const appConfig = {
  appScope: '/monaka/',
  mainCacheName: 'monacahe_v0.1.0',
  offlineCacheName: 'monacache_offline_v0.1.0',
  mediaCacheName: 'monacache_media_v1.0.0',
  mainCacheList: [
   '/monaka/',
   '/monaka/html/404.html',
   '/monaka/html/500.html',
   '/monaka/html/about.html',
   '/monaka/html/error.html',
   '/monaka/html/recommend.html',
   '/monaka/app.js',
   '/monaka/app.webmanifest',
   '/monaka/appConfig.js',
   '/monaka/index.html',
   '/monaka/css/app.css',
   '/monaka/css/base.css',
   '/monaka/js/index.js',
   '/monaka/js/about.js',
   '/monaka/components/header/header.js',
   '/monaka/components/header/header.css',
   '/monaka/components/header/logo/logo.js',
   '/monaka/components/header/logo/logo.css',
   '/monaka/components/header/navi/nav.js',
   '/monaka/components/header/navi/nav.css',
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
