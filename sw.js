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
  self.skipWaiting();
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
    }).then(function() {
      return self.clients.claim();
    })
  );
});
self.addEventListener('fetch', function(event) {
  if (event.request.url.includes('sw.js')) return;
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
