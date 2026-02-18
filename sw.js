// Minimal Service Worker to enable PWA installation
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Pass requests through to the network normally
  e.respondWith(fetch(e.request));
});
