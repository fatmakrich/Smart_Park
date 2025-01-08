// Attendre que le DOM soit chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
    // Fonction pour générer un code de vérification aléatoire
    function generateCodeVerifier() {
        const array = new Uint32Array(28); // 28 * 4 bytes = 112 bytes (suffisant pour base64url)
        window.crypto.getRandomValues(array);
        return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    }

    // Calculer le hash SHA256 d'une chaîne
    function sha256(plain) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }

    // Encoder en base64url
    function base64urlencode(str) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, ''); // Supprimer les remplissages
    }

    // Générer le challenge PKCE à partir du code verifier
    async function pkceChallengeFromVerifier(codeVerifier) {
        const hashed = await sha256(codeVerifier);
        return base64urlencode(hashed);
    }

    // Étape 1 : Pré-autorisation via /api/authorize
    async function preAuthorize() {
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

        // Stocker le codeVerifier pour l'utiliser plus tard
        localStorage.setItem("codeVerifier", codeVerifier);

        const clientId = "1"; // À modifier si nécessaire
        const preAuthorizationHeader = `Bearer ${btoa(`${clientId}#${codeChallenge}`)}`;

        try {
            const response = await fetch("http://localhost:8080/api/authorize", {
                method: "POST",
                headers: {
                    "Pre-Authorization": preAuthorizationHeader,
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else if (response.ok) {
                const data = await response.json();
                console.log("Response from /authorize:", data);
            } else {
                console.error("Error during /authorize:", await response.text());
            }
        } catch (error) {
            console.error("Error during pre-authorization:", error);
        }
    }

    // Étape 2 : Authentification utilisateur via /api/authenticate
    async function authenticateUser(mail, password) {
        const body = JSON.stringify({ mail, password });

        try {
            const response = await fetch("http://localhost:8080/api/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body,
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Authentication successful:", data);

                // Récupérer le code d'autorisation
                const authorizationCode = data.authorization_code;
                console.log("Authorization Code:", authorizationCode);

                // Étape 3 : Échanger le code contre un access token
                await exchangeAuthorizationCodeForToken(authorizationCode);

                // Rediriger vers la carte
                window.location.href = "map.html";
            } else {
                console.error("Authentication failed:", await response.text());
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    }

    // Étape 3 : Échanger le code d'autorisation pour un access token
    async function exchangeAuthorizationCodeForToken(authorizationCode) {
        const codeVerifier = localStorage.getItem("codeVerifier");

        if (!codeVerifier) {
            console.error("Code verifier is missing. Cannot exchange authorization code.");
            return;
        }

        const body = JSON.stringify({
            authorization_code: authorizationCode,
            code_verifier: codeVerifier
        });

        try {
            const response = await fetch("http://localhost:8080/api/oauth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body,
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Access Token Response:", data);

                const accessToken = data.access_token;
                console.log("Access Token:", accessToken);
            } else {
                console.error("Error during token exchange:", await response.text());
            }
        } catch (error) {
            console.error("Error during token exchange:", error);
        }
    }

    // Ajouter les écouteurs d'événements
    const signInButton = document.getElementById("signInButton");
    if (signInButton) {
        signInButton.addEventListener("click", (e) => {
            e.preventDefault(); // Empêcher le formulaire de se soumettre
            const mail = document.getElementById("mail").value;
            const password = document.getElementById("password").value;
            authenticateUser(mail, password);
        });
    }

    const preAuthorizeButton = document.getElementById("preAuthorizeButton");
    if (preAuthorizeButton) {
        preAuthorizeButton.addEventListener("click", preAuthorize);
    }
});
