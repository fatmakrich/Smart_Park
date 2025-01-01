// Exemple de fonction pour un clic sur un lien qui peut rediriger dynamiquement si nécessaire.
document.addEventListener('DOMContentLoaded', () => {
    const arrowLink = document.getElementById('arrow-link');
    const signInLink = document.getElementById('goToSignIn');

    if (arrowLink) {
        arrowLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'home'; // Redirection vers la page home
        });
    }

    if (signInLink) {
        signInLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'signin'; // Redirection vers la page de connexion
        });
    }
});
