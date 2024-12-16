const CACHE_NAME = 'smartpark-cache';
const urlsToCache = [
    '/',
    '/index.html',
    '/pages/home.html',
    '/pages/signin.html',
    '/css/home.css',
    '/css/signin.css',
    '/js/main.js',
    '/js/signin.js',
    '/images/smartpark.png',
    '/images/favicon.ico'
];

// Installer le service worker et mettre en cache les fichiers
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Servir les fichiers à partir du cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});

// Activer le service worker et gérer les anciennes versions du cache
self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['smartpark-cache'];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
