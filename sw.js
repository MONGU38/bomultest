// 캐시 버전 (업데이트할 때마다 이 숫자를 올리세요!)
const CACHE_VERSION = new Date().toISOString();
const CACHE_NAME = `treasure-box-v${CACHE_VERSION}`;

// 캐시할 파일들
const urlsToCache = [
  '/bomultest/',
  '/bomultest/index.html',
  '/bomultest/manifest.json',
  '/bomultest/app_icon512.png',
  '/bomultest/app_icon1024.png'
];

// Service Worker 설치
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Service Worker 활성화 및 구버전 캐시 삭제
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

// 네트워크 요청 처리
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      }
    )
  );
});
