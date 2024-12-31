const cacheName = 'smartpark-cache-v1'; // Add versioning to cache
const filesToCache = [
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
    '/js/signup.js',
];

// Install event: Cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        }).catch((error) => {
            console.error('Failed to cache files during install:', error);
        })
    );
});

// Fetch event: Serve from cache or fetch from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        (async () => {
            try {
                const cache = await caches.open(cacheName);

                // Only cache GET requests
                if (event.request.method === 'GET') {
                    const cachedResponse = await cache.match(event.request);

                    // Return cache if available, else fetch from network
                    if (cachedResponse) return cachedResponse;

                    const networkResponse = await fetch(event.request);
                    // Clone and cache the response
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }

                // Return network response for non-GET requests
                return fetch(event.request);
            } catch (error) {
                console.error('Fetch failed:', error);
                return caches.match('/offline.html'); // Optionally return an offline fallback
            }
        })()
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [cacheName];

    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (!cacheWhitelist.includes(cache)) {
                        console.log(`Deleting old cache: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});
