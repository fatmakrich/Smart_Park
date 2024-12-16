import "./routes.js"

(() => {
    'use strict'

    window.onload = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./service-worker.js').then(function (registration) {
                // Service worker registered correctly.
                console.log('ServiceWorker registration successful with scope:', registration.scope)
            }).catch(function (err) {
                // Troubles in registering the service worker. :(
                console.log('Serviceworker registration falled:', err)
            });
        }
    }
})();