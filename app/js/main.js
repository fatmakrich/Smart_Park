import { generateClientId, generateCodeVerifier, generateCodeChallenge } from './oauth.js';

async function loadPage(page) {
    const root = document.getElementById('root');

    try {
        // Fetch and load the HTML content for the page
        const response = await fetch(`./pages/${page}.html`);
        if (!response.ok) {
            throw new Error(`Page ${page} not found`);
        }

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
            if (button) {
                button.addEventListener('click', async () => {
                    // Generate client ID, code verifier, and code challenge
                    const clientId = generateClientId();
                    const codeVerifier = generateCodeVerifier();
                    const codeChallenge = await generateCodeChallenge(codeVerifier);

                    // Set code challenge in a secure cookie (excluding HttpOnly)
                    document.cookie = `code_challenge=${codeChallenge}; Secure; SameSite=Strict`;

                    // Log the values in the console
                    console.log('Client ID:', clientId);
                    console.log('Code Verifier:', codeVerifier);
                    console.log('Code Challenge:', codeChallenge);

                    // Navigate to the SignIn page
                    loadPage('SignIn');
                });
            }
        }
    } catch (error) {
        console.error('Error loading page:', error.message);
        root.innerHTML = `<p>Error: Could not load the page.</p>`;
    }
}

// Start with the home page
loadPage('home');
