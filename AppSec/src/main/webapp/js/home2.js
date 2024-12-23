import { generateClientId, generateCodeVerifier, generateCodeChallenge } from './oauth';
import "./routes.js"

document.addEventListener('DOMContentLoaded', () => {
    const signInLink = document.getElementById('goToSignIn');

    // Vérifier si le lien "Sign In" existe
    if (signInLink) {
        signInLink.addEventListener('click', async (e) => {
            e.preventDefault(); // Empêcher la redirection immédiate

            try {
                // Générer un client_id
                const clientId = generateClientId();

                // Générer un code_verifier
                const codeVerifier = generateCodeVerifier();

                // Générer un code_challenge
                const codeChallenge = await generateCodeChallenge(codeVerifier);

                // Afficher les valeurs dans la console
                console.log('Client ID:', clientId);
                console.log('Code Verifier:', codeVerifier);
                console.log('Code Challenge:', codeChallenge);

                // Rediriger vers la page /signin après un léger délai
                setTimeout(() => {
                    window.location.href = '/signin';  // Redirection vers la page /signin
                }, 500); // Délai de 500ms pour voir les logs dans la console
            } catch (error) {
                console.error('Erreur lors de la génération des codes :', error);
            }
        });
    } else {
        console.log('Le lien "Sign In" n\'a pas été trouvé.');
    }
});
