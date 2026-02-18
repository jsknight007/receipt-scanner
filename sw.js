// Minimal Service Worker to enable PWA installation
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // This version simply passes through requests to the network
  e.respondWith(fetch(e.request));
});
