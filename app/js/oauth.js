/**
 * Générer un ID client aléatoire.
 */
function generateClientId() {
    return 'client_' + Math.random().toString(36).substring(2, 15);
}

/**
 * Générer un code_verifier (Base64URL sans padding).
 */
function generateCodeVerifier() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Générer un code_challenge à partir du code_verifier (SHA-256).
 */
async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Effectuer automatiquement le processus OAuth lors du chargement de l'application.
 */
async function autoOAuth() {
    try {
        // Générer les valeurs nécessaires
        const clientId = generateClientId();
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        // Stocker le codeVerifier localement pour l'utiliser plus tard
        localStorage.setItem("codeVerifier", codeVerifier);

        // Envoyer la requête POST pour obtenir le code d'autorisation
        const response = await fetch("/authorize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: clientId,
                code_challenge: codeChallenge,
                code_challenge_method: "S256"
            })
        });

        // Vérifier si la requête a réussi
        if (!response.ok) {
            throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
        }

        // Extraire le code d'autorisation de la réponse
        const data = await response.json();
        console.log("Authorization Code:", data.authorization_code);

        // Stocker le code d'autorisation pour un usage ultérieur
        localStorage.setItem("authorizationCode", data.authorization_code);
    } catch (error) {
        console.error("Erreur lors du processus OAuth :", error);
    }
}

// Exécuter le processus OAuth automatiquement au chargement de la page
document.addEventListener("DOMContentLoaded", autoOAuth);
