const CACHE_NAME = 'smartpark-cache';
const urlsToCache = [
    '/',
    '/index.html',
    '/pages/home.html',
    '/pages/SignIn.html',
    '/css/home.css',
    '/css/SignIn.css',
    '/js/oauth.js',
    '/js/main.js',
    '/js/SignIn.js',
    '/images/smartpark.png',
    '/images/favicon.ico'
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Serve cached assets if available
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['smartpark-cache'];  // List of caches that should be kept

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        // If the cache is not in the whitelist, delete it
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
