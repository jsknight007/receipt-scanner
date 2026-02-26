const CACHE_NAME = 'ledger-pro-v4.5';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon.png'
];

// INSTALL
self.addEventListener('install', (e) => {
  self.skipWaiting(); // activate immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// ACTIVATE – clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH – network first for API, cache first for UI
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // 🔌 Apps Script Web App (always network)
  if (url.hostname.includes('script.google.com')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // 🧠 UI files → cache first
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request);
    })
  );
});
