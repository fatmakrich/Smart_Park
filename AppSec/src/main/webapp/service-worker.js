let cacheName = 'smartpark-cache';
let filesToCache = [
    '/',
    '/index.html',
    '/pages/home.html',
    '/pages/home2.html',
    '/pages/signin.html',
    '/pages/signup.html',

    '/css/home.css',
    '/css/home2.css',
    '/css/signin.css',
    '/css/signup.css',
    '/css/style.css',

    '/js/oauth.js',
    '/js/home2.js',
    '/js/main.js',
];

// Installer le service worker et mettre en cache les fichiers
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
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
