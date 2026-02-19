const CACHE_NAME = 'ledger-v1';
// We don't even need to cache files, just handle the event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});
