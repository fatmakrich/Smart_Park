import VanillaRouter from './router.js';  // Assure-toi que le fichier router.js est bien dans le dossier js

// Définir le routeur avec les routes
const router = new VanillaRouter({
    type: 'history',  // Utilisation de l'historique de navigation
    routes: {
        '/': () => loadPage('home'),  // Route d'accueil
        '/signin': () => loadPage('signin'),
        '/signup': () => loadPage('signup'),
    }
});

// Lancer le routeur
router.listen();

// Fonction pour charger dynamiquement une page HTML
async function loadPage(page) {
    const root = document.getElementById('root');
    const head = document.querySelector('head');
    try {
        // Charger le contenu de la page demandée
        const response = await fetch(`./pages/${page}.html`);
        if (!response.ok) {
            throw new Error(`Erreur: Impossible de charger la page ${page}`);
        }

        // Vider le contenu du root
        root.innerHTML = await response.text();

        // Ajouter dynamiquement le fichier CSS spécifique à la page
        const existingLink = document.querySelector(`#page-style`);
        if (existingLink) {
            existingLink.remove();  // Supprimer l'ancien fichier CSS si présent
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `./css/${page}.css`;  // Charger le CSS spécifique à la page
        link.id = 'page-style';  // Id pour pouvoir le manipuler
        head.appendChild(link);

    } catch (error) {
        root.innerHTML = `<h1>Erreur: ${error.message}</h1>`;
    }
}

// Rediriger vers la page d'accueil
router.setRoute('/');
