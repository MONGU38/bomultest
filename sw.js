const CACHE_VERSION = new Date().toISOString();
const CACHE_NAME = `treasure-box-v${CACHE_VERSION}`;
const urlsToCache = [
  '/bomultest/',
  '/bomultest/index.html',
  '/bomultest/manifest.json',
  '/bomultest/app_icon512.png',
  '/bomultest/app_icon1024.png'
];
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
self.addEventListener('fetch', function(event) {
  if (event.request.url.includes('sw.js')) return;
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      }
    )
  );
});
