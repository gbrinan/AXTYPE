// 앱 셸을 미리 캐시해 오프라인·재방문에서 즉시 뜨게 한다.
// 파일을 추가하거나 바꾸면 VERSION 을 올린다. 옛 캐시는 activate 에서 지운다.
const VERSION = 'axtype-v1';
const SHELL = [
  './',
  'index.html',
  'app.js',
  'data.js',
  'scoring.js',
  'style.css',
  'manifest.webmanifest',
  'assets/prototyper.webp',
  'assets/builder.webp',
  'assets/sweeper.webp',
  'assets/grower.webp',
  'assets/maintainer.webp',
  'icons/favicon.svg',
  'icons/icon-192.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

// 같은 출처: 캐시 우선, 없으면 네트워크에서 받아 캐시에 넣는다. 다른 출처(폰트 등)는 건드리지 않는다.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(e.request).then((res) => {
          if (res.ok) caches.open(VERSION).then((c) => c.put(e.request, res.clone()));
          return res;
        }),
    ),
  );
});
