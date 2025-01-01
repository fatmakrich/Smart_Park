const CACHE_NAME = 'smart-park-cache';
const urlsToCache = [
    '/',
    '/home.html',
    '/signin.html',
    '/signup.html',
    '/forgetpassword.html',

    '/js/index.js',
    '/js/script.js',
    '/js/signin.js',
    '/js/signup.js',

    '/css/home.css',
    '/css/signin.css',

    '/images/image.png',
    '/images/image1.png',
    '/images/search.png',
    '/images/car.png',
];

// Installation du service worker et mise en cache des fichiers
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching files');
            return cache.addAll(urlsToCache);
        })
    );
});

// Récupération des ressources mises en cache lors des requêtes
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('Serving from cache: ', event.request.url);
                return cachedResponse;
            }
            console.log('Fetching from network: ', event.request.url);
            return fetch(event.request);
        })
    );
});

// Activation du service worker et suppression des anciennes caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache: ', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
