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

    '/js/home2.js',
    '/js/main.js',
];

// Installer le service worker et mettre en cache les fichiers
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).then((response) => {
            // Cloner la réponse immédiatement
            const responseClone = response.clone();

            // Mettre la réponse en cache
            caches.open(cacheName).then((cache) => {
                cache.put(event.request, responseClone);
            });

            // Retourner la réponse d'origine au client
            return response;
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
