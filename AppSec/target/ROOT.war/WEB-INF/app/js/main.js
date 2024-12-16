async function loadPage(page) {
    const root = document.getElementById('root');
    const response = await fetch(`./pages/${page}.html`);
    const content = await response.text();
    root.innerHTML = content;

    // Dynamically load the correct CSS file
    const existingLink = document.getElementById('dynamic-css');
    if (existingLink) {
        existingLink.remove();
    }

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.id = 'dynamic-css';
    cssLink.href = `./css/${page}.css`;
    document.head.appendChild(cssLink);

    // Special logic for home page
    if (page === 'home') {
        const button = document.getElementById('goToSignIn');
        button.addEventListener('click', () => loadPage('SignIn'));
    }
}

// Register the Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/service-worker.js')
        .then(function () {
            console.log("Service Worker registered successfully!");
        })
        .catch(function (err) {
            console.log("Error registering Service Worker:", err);
        });
}

// Start with the home page
loadPage('home');
